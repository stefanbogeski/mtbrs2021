import Axios from "axios";

const BASE_URL = "BASE_URL/";
const TOKEN = '5a67ec7d-bfa1-501a-9943-7ce0f2bb089d';

export const ApiInstance = Axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { 'Authorization': `Bearer ${TOKEN}` }
})