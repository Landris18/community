import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "../utility/utility";


export default class Service {
    static baseUrl: string = "https://cashbase-api.fly.dev/api/";

    private static getBearerToken(): AxiosRequestConfig | {} {
        const accessToken = getToken();
        if (accessToken) {
            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
        }
        console.log(accessToken);
        
        return {};
    }

    static async login(credentials: { username: string, password: string }) {
        let res;
        await axios.post(`${this.baseUrl}login`, credentials).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getOneMembre(id: number) {
        let res;
        await axios.get(`${this.baseUrl}membre/${id}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }
}