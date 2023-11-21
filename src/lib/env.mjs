import 'dotenv/config';
import assert from 'assert';

assert(process.env.API_REQUEST_TIMEOUT, 'API_REQUEST_TIMEOUT is not defined');
assert(process.env.ROCKSMITH_API_HOST, 'ROCKSMITH_API_HOST is not defined.');
assert(process.env.ROCKSMITH_API_VERSION, 'ROCKSMITH_API_VERSION is not defined.');
