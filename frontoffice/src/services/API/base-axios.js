import axios from "axios";
import config from "@/config/config.js";
import router from "@/router/index.js";

const baseAxios = axios.create({
    baseURL: config.apiDomain,
    timeout: 10000,
});

baseAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            if (error.response.status && error.response.status === 401) {
                if(localStorage.getItem('token')) {
                    localStorage.removeItem('token');
                }
                router.push('/login');
            }
        }
        return Promise.reject(error);
    }
);
export default baseAxios;