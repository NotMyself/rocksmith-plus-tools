import delay from './delay.mjs';
import logger from './log.mjs';

export default async function (res) {
  if (res.headers['x-rate-limit-limit']) {
    const limit = res.headers['x-rate-limit-limit'];
    const remaining = Number(res.headers['x-rate-limit-remaining']);
    const reset = new Date(res.headers['x-rate-limit-reset']);

    logger.debug(`Rate Limiting: Limit ${limit}, Remaining: ${remaining}, reset: ${reset}`);

    if (remaining === 0) {
      await delay(reset - new Date());
    }
  }
  return res;
}
