/**
 * This is a server that returns dynamic video.
 * Run `npm run server` to try it out!
 */

import { bundle } from '@remotion/bundler';
import { getCompositions, renderFrames, stitchFramesToVideo } from '@remotion/renderer';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';

const compositionId = 'FavoriteEmojis';
const port = 8000;
const app = express();
const cache = new Map<string, string>();

app.get('/', async (req, res) => {
  const sendFile = (file: string) => {
    fs.createReadStream(file)
      .pipe(res)
      .on('close', () => {
        res.end();
      });
  };
  try {
    if (cache.get(JSON.stringify(req.query))) {
      sendFile(cache.get(JSON.stringify(req.query)) as string);
      return;
    }
    const bundled = await bundle(path.join(__dirname, './src/index.tsx'));
    const comps = await getCompositions(bundled);
    const video = comps.find((c) => c.id === compositionId);
    if (!video) {
      throw new Error(`No video called ${compositionId}`);
    }
    res.set('content-type', 'video/mp4');

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));
    await renderFrames({
      config: video,
      webpackBundle: bundled,
      onStart: () => console.log('Rendering frames...'),
      onFrameUpdate: (f) => {
        if (f % 10 === 0) {
          console.log(`Rendered frame ${f}`);
        }
      },
      parallelism: null,
      outputDir: tmpDir,
      userProps: req.query,
      compositionId,
    });

    const finalOutput = path.join(tmpDir, `out.mp4`);
    await stitchFramesToVideo({
      dir: tmpDir,
      force: true,
      fps: video.fps,
      height: video.height,
      width: video.width,
      outputLocation: finalOutput,
    });
    cache.set(JSON.stringify(req.query), finalOutput);
    sendFile(finalOutput);
    console.log('Video rendered and sent!');
  } catch (err) {
    console.error(err);
    res.json({
      error: err,
    });
  }
});

app.listen(port);

console.log(
  [
    `The server has started on http://localhost:${port}!`,
    `You can render a video by passing props as URL parameters.`,
    '',
    `If you are running FavoriteEmojis, try this:`,
    '',
    `http://localhost:${port}/?name=Victor&emojis=%F0%9F%A4%AF&emojis=%F0%9F%98%82&emojis=%F0%9F%99%8C&emojis=%E2%9C%A8`,
    '',
  ].join('\n')
);
