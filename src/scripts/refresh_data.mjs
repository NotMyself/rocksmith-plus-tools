#!/usr/bin/env node

import '../lib/env.mjs';
import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';
import logger from '../lib/log.mjs';
import { getGenres, getSongsByGenre } from '../lib/api.mjs';

(async function () {
  try {
    logger.info('Refresh Data Started');
    const dataPath = path.join(process.cwd(), 'data');

    const genres = await getGenres();

    fs.mkdirSync(dataPath, { recursive: true });
    fs.writeFileSync(path.join(dataPath, `genres.json`), JSON.stringify(genres, null, 2));

    for (const genre of genres) {
      const genrePath = path.join(dataPath, sanitize(genre));
      const songs = await getSongsByGenre(genre);

      fs.mkdirSync(genrePath, { recursive: true });

      for (const song of songs) {
        logger.info(`Writing ${song.artistName} - ${song.songName}`);
        const artistPath = path.join(
          genrePath,
          sanitize(song.artistName),
          sanitize(song.albumName)
        );
        const file = path.join(artistPath, `${song.songId}.json`);
        fs.mkdirSync(artistPath, { recursive: true });
        fs.writeFileSync(file, JSON.stringify(song, null, 2));
      }
    }

    logger.end();
    process.exit(0);
  } catch (err) {
    logger.error(err);
    logger.end();
    process.exit(1);
  }
})();
