import * as dotenv from 'dotenv';
import axios from "axios";
import rateLimit from "axios-rate-limit";

dotenv.config();

const songApiUrl = `https://${process.env.ROCKSMITH_API_HOST}/${process.env.ROCKSMITH_API_VERSION}/songLibrary`;

const songApiInstance = axios.create({
    baseURL: songApiUrl,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "rocksmith_plus_tools"
    }
});

const songApi = rateLimit(songApiInstance, {
    maxRequests: process.env.ROCKSMITH_API_MAX_REQUESTS,
    perMilliseconds: process.env.ROCKSMITH_API_PER_MILLISECONDS,
    maxRPS: process.env.ROCKSMITH_API_MAX_RPS
})

export async function getGenres() { 
    const res = await songApi.get('/getTypesOfGenre');
    
    return res.data.data;
}

export async function getSongsByGenre(genre, params = {page:1, pageSize: 25}) {
    const res = await songApi.get('/songs',{ params:{ genre, ...params } });
    const totalPages = res.data.totalPages;
    const pageRequests = Array(totalPages).map(async (_, page) => {
        return await songApi.get('/songs', { params: { genre, page, pageSize: params.pageSize} })
            .then(res => res.data.data);
    });
    const songs = await Promise.all(pageRequests);

    return songs.addRange(res.data.data);    
}
