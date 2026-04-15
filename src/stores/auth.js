import {defineStore} from "pinia";
import axios from "axios";
import api from '@/util/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        baseUrl : process.env.VUE_APP_BASE_URL,
        clientId : process.env.VUE_APP_CLIENT_ID,
        clientSecret : process.env.VUE_APP_CLIENT_SECRET,
        token: null,
        refresh_token: null,
        user: null
    }),
    getters: {
        isLoggedIn: (state) => !!state.baseUrl,//!!state.token && !!state.user,
    },
    actions: {
        async register(username, password, re_password) {
            return await axios.post(this.baseUrl + '/auth/users/', {
                username: username,
                password: password,
                re_password: re_password
            });
        },
        async login(username, password) {
            const data = new URLSearchParams()
            data.append('grant_type', 'password')
            data.append('client_id', this.clientId)
            data.append('client_secret', this.clientSecret)
            data.append('username', username)
            data.append('password', password)

            const response = await axios.post(`${this.baseUrl}`+'/oauth/token/',data.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials:true,
            })

            const { access_token, refresh_token } = response.data;
            // const user = await axios.get(this.baseUrl + '/auth/users/me', {
            //     headers: {
            //         Authorization: `Bearer ${access_token}`
            //     }
            // }).then(res => res.data)

            this.refresh_token = refresh_token
            this.token = access_token
            // this.user = user
            const user = await this.fetchUser();
            console.log(user)
            // localStorage.setItem('token', this.token)
            // localStorage.setItem('user', JSON.stringify(user))
        },
        async fetchUser() {
            console.log("Token :", this.token)
            if (!this.token) return false;
            try {
                const res = await api.get(`/auth/users/me`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                });

                this.user = res.data;
                return true;
            } catch (err) {
                console.error("Fetch user failed", err);
                this.user = null;
            }
        },
        async logout() {
            if(this.token){
                const body = new URLSearchParams();
                body.append("token", this.token);
                body.append("client_id", this.clientId);
                body.append("client_secret", this.clientSecret);

                await axios.post(this.baseUrl + '/oauth/revoke_token/', 
                body.toString(),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    withCredentials:true
                });
            }else{
                console.log("No token found");
            }

            this.token = null;
            this.user = null;
            this.refresh_token = null;
            // localStorage.removeItem('token')
            // localStorage.removeItem('user')
        },
        async restoreSession() {
            try {
                if (!this.token && this.refresh_token) {
                await this.refreshToken();
                }
                await this.fetchUser();
            } catch {
                console.log("No active session.");
            }
        },

        async refreshToken() {
            try {
                const form = new URLSearchParams();
                form.append("grant_type", "refresh_token");
                form.append("refresh_token", this.refresh_token);
                form.append("client_id", this.clientId);
                form.append("client_secret", this.clientSecret);

                const response = await axios.post(
                `${this.baseUrl}/oauth/token/`,
                form.toString(),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    withCredentials: true,
                }
                );

                this.token = response.data.access_token;
                this.refresh_token = response.data.refresh_token;
                return true;
            } catch (e) {
                this.token = null;
                this.user = null;
                return false;
            }
        }


    }
})