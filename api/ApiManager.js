import axios from 'axios';

const ApiManager = axios.create({
    baseURL: 'http://220.247.207.187',
    responseType: 'json',
    withCredentials: true,
});

export default ApiManager;