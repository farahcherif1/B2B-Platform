
import baseAxios from "./base-axios";

let apiClientAuth = baseAxios;
    apiClientAuth.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if(token){
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    
export default apiClientAuth;