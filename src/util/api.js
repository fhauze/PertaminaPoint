import axios from "axios"
import { useAuthStore } from "@/stores/auth";

const api = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    clientId : process.env.VUE_APP_CLIENT_ID,
    clientSecret : process.env.VUE_APP_CLIENT_SECRET,
    headers:{
        "Content-Type":"application/json"
    }
})

api.interceptors.request.use(
    config =>{
        const auth = useAuthStore()
        if(auth.token){
            config.headers.Authorization = `Bearer ${auth.token}`
        }
        return config
    },
    error => Promise.reject(error)
)

api.interceptors.response.use(
    response => response,
    async error => {
        const auth = useAuthStore();
        const originalRequest = error.config;

        if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry =true;
            const success = await auth.refreshToken();
            if(success){
                originalRequest.headers.Authorization = `Bearer ${auth.token}`;
                return api(originalRequest);
            }

            await auth.logout();
            window.location = "/login";

            // try {
            //     const res = await axios.post(`${this.baseURL}` + "/oauth/token/refresh/", {},{withCredentials:true});
                
            //     auth.token = res.data.access_token;
            //     originalRequest.headers.Authorization = `Bearer ${auth.token}`;
                // error.config.headers.Authorization = `Bearer ${res.data.access}`;
                // return api.request(error.config);
                // return api(originalRequest)
            // } catch (refreshError) {
                // jika refresh juga gagal, logout
                // window.location = "/login";
                // auth.logout();
                // return Promise.reject(refreshError)
            // }
        }
        return Promise.reject(error)
    }
)

export default api