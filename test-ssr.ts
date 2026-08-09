import fs from 'fs';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server.js';
import App from './src/App.tsx';

async function test() {
  try {
    const html = renderToString(React.createElement(App));
    console.log("Rendered successfully!", html.substring(0, 100));
  } catch (e) {
    console.error("Render failed!", e);
  }
}
test();
