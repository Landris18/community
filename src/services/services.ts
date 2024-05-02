import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "../utility/utility";


export default class Service {
    static baseUrl: string = "http://localhost:3000/api/";
    // static baseUrl: string = "https://cashbase.onrender.com/api/";

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

    static async getCotisations(annee?: number, mois?: string, onlyPaid?: boolean, groupByMembre?: boolean) {
        let res;
        let query: string = `?`;

        if (annee) query += `annee=${annee}`;
        if (mois) query += `&mois=${mois}`;
        if (onlyPaid) query += `&only_paid=${onlyPaid}`;
        if (groupByMembre) query += `&group_by_membre=${groupByMembre}`;

        await axios.get(`${this.baseUrl}cotisations${query !== `?` ? query : ``}`, {
            ...this.getBearerToken(),
        }).then((response) => {
            res = response.data;
        }).catch((error) => {
            throw error;
        });
        return res;
    }

    static async addCotisations(
        cotisationsData: {
            membre_id: number, mode_paiement: string, montant: number, date_paiement: string, lst_mois_annee: string[]
        }
    ) {
        let res;
        await axios.post(`${this.baseUrl}add_cotisations`, cotisationsData, {
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