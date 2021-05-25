import Axios from "axios";

const BASE_URL = "BASE_URL/";
const TOKEN = 'token';

export const ApiInstance = Axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { 'Authorization': `Bearer ${TOKEN}` }
})