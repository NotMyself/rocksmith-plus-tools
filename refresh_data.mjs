#!/usr/bin/env node

import chalk from "chalk";
import assert from "assert";
import { getGenres, getSongsByGenre } from "./lib/api.mjs";

(async function () {
  try {
    const genres = await getGenres();

    const songs = await getSongsByGenre('rock');
    for(const genre of genres)
        console.log(genre);

    process.exit(0);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
})();