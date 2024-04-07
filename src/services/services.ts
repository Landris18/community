import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "../utility/utility";


export default class Service {
    // static baseUrl: string = "https://cashbase-api.fly.dev/api/";
    static baseUrl: string = "https://cashbase.onrender.com/api/";


    private static getBearerToken(): AxiosRequestConfig | {} {
        const accessToken = getToken();
        if (accessToken) {
            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };
        }
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

    static async logout(removeAll?: boolean) {
        let res;
        await axios.get(`${this.baseUrl}logout${removeAll ? `?remove_all=${removeAll}` : ``}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getMembres() {
        let res;
        await axios.get(`${this.baseUrl}membres`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getMembreById(id: number) {
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

    static async updatePassword(passwordData: { id: number, old_password: string, new_password: string }) {
        let res;
        await axios.put(`${this.baseUrl}update_password`, passwordData, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getTotals() {
        let res;
        await axios.get(`${this.baseUrl}get_totals`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getStats(annee: number) {
        let res;
        await axios.get(`${this.baseUrl}get_stats?annee=${annee}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getCotisations(annee: number, mois: string, onlyPaid: boolean) {
        let res;
        await axios.get(`${this.baseUrl}cotisations?annee=${annee}&mois=${mois}&only_paid=${onlyPaid}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getRevenus(annee: number, mois: string) {
        let res;
        await axios.get(`${this.baseUrl}revenus?annee=${annee}&mois=${mois}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getDepenses(annee: number, mois: string, forDette: boolean) {
        let res;
        await axios.get(`${this.baseUrl}depenses?annee=${annee}&mois=${mois}&for_dette=${forDette}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async getDettes() {
        let res;
        await axios.get(`${this.baseUrl}dettes`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }
}