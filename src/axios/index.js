import axios from 'axios'

const  BASE_URL = 'https://weatherstation-server.onrender.com';


export const CLIENT_API = axios.create({
    baseURL:  BASE_URL, 
    withCredentials:true,
})