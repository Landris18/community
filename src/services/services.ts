import axios from "axios";


export default class Service {
    static baseUrl: string = "https://cashbase-api.fly.dev/api/";

    static async login(credentials: { username: string, password: string }) {
        let res;
        await axios.post(`${this.baseUrl}login`, credentials).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }
}