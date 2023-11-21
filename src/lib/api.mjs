import axios from 'axios';
import logger from '../lib/log.mjs';
import ratelimit from '../lib/interceptor.ratelimit.mjs';

const songApiUrl = `https://${process.env.ROCKSMITH_API_HOST}/${process.env.ROCKSMITH_API_VERSION}/songLibrary`;

logger.info(`Using API: ${songApiUrl}`);

const songApi = axios.create({
  baseURL: songApiUrl,
  timeout: process.env.API_REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'rocksmith-plus-tools',
  },
});

songApi.interceptors.response.use(ratelimit);

logger.debug(
  `Created axios instance url: ${songApiUrl}, timeout: ${process.env.API_REQUEST_TIMEOUT}`
);

export async function getGenres() {
  logger.info('api.getGenres');

  const res = await songApi.get('/getTypesOfGenre');

  logger.debug(`${res.data.data.length} genres fetched: ${res.data.data.join(', ')}`);

  return res.data.data;
}

export async function getSongsByGenre(genre, params = { page: 1, pageSize: 25 }) {
  logger.info(`api.getSongsByGenre genre: ${genre}`);
  const res = await songApi.get('/songs', { params: { genre, ...params } });
  const songs = [res.data.data];
  const totalPages = res.data.totalPages;
  logger.info(`Fetched page: ${params.page} of ${totalPages} in ${genre}`);

  for (let page = params.page + 1; page <= totalPages; page++) {
    const songPage = await songApi
      .get('/songs', { params: { genre, page, pageSize: params.pageSize } })
      .then((res) => {
        logger.debug(`Fetched page: ${page} of ${totalPages} in ${genre}`);
        return res.data.data;
      });
    songs.push(songPage);
  }

  const allSongs = songs.flat();

  logger.info(`Fetched ${allSongs.length + 1} songs for genre: ${genre}`);

  return allSongs;
}
