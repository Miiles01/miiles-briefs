import fs from 'node:fs/promises';
import path from 'node:path';
import { registerMediabunnyServer } from '@mediabunny/server';
import { canUseVideoMatting, downloadVideoMattingModel, separateVideoLayers } from '@remotion/video-matting';

const input = process.argv[2] ?? 'public/ugc-template-raw.mp4';
const basePath = process.argv[3] ?? 'public/ugc-template-base.webm';
const foregroundPath = process.argv[4] ?? 'public/ugc-template-foreground.webm';

registerMediabunnyServer();
const support = await canUseVideoMatting({ model: 'modnet' });
if (!support.supported) throw new Error(support.detailedReason ?? 'WebGPU matting is unavailable');
await downloadVideoMattingModel({ model: 'modnet', onProgress: ({ file, progress }) => console.log(`download ${file ?? 'model'} ${Math.round(progress * 100)}%`) });

const result = await separateVideoLayers({
  src: path.resolve(input),
  model: 'modnet',
  audio: 'none',
  onModelLoadProgress: ({ status, progress }) => console.log(`model ${status} ${progress ?? ''}`),
  onProgress: ({ stage, progress, processedFrames, durationInSeconds }) => {
    console.log(`${stage}: ${progress == null ? 'finalizing' : `${Math.round(progress * 100)}%`} (${processedFrames} frames, ${durationInSeconds.toFixed(1)}s)`);
  },
});

try {
  await fs.mkdir(path.dirname(basePath), { recursive: true });
  await fs.mkdir(path.dirname(foregroundPath), { recursive: true });
  await fs.writeFile(basePath, Buffer.from(await (await result.base.getBlob()).arrayBuffer()));
  await fs.writeFile(foregroundPath, Buffer.from(await (await result.foreground.getBlob()).arrayBuffer()));
  console.log(JSON.stringify({ width: result.width, height: result.height, durationInSeconds: result.durationInSeconds, processedFrames: result.processedFrames, basePath, foregroundPath }, null, 2));
} finally {
  await result[Symbol.asyncDispose]();
}
