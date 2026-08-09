import fs from 'fs';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App'; // Might need to compile it or just import via TS-Node?

// This might be complicated since it's TSX.
