import Service from "../Service";
import type { AxiosResponse } from "axios";
import axios from "../../api/Axios";
import type { ResponseData } from "../../types/common/CommonTypes";
import type { AccountInformation, SignInInformation, LogoutInfromation } from "../../data/account/AccountInformation";

class AccountSerice extends Service {
    private abortController: AbortController;
    private readonly USER_ROOT_URL = "/account";
    private readonly AUTHENTICATION_ROOT_URL = "/api/auth";

    constructor() {
        super();
        this.abortController = new AbortController();
    }

    // TODO: this method is not in use. should be updated if needed.
    async getAccountInformation(userId: number): Promise<AxiosResponse<ResponseData<AccountInformation>>> {
        try {
            const institutionResponse = await this.axiosPrivate.get<
                ResponseData<AccountInformation>
            >(`${this.USER_ROOT_URL}/getaccinfo${userId}`, {
                signal: this.abortController.signal,
            });

            return institutionResponse;
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                return error.response;
            }
            throw error;
        }
    }

    async saveAccountInformation(accInfo: AccountInformation): Promise<AxiosResponse<any>> {
        try {
            const institutionResponse = await axios.post(
                this.USER_ROOT_URL + "/create-user",
                accInfo
            );

            return institutionResponse;
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                return error.response;
            }
            throw error;
        }
    }

    async signIn(credentials: SignInInformation): Promise<AxiosResponse<any>> {
        try {
            const response = await axios.post(
                this.AUTHENTICATION_ROOT_URL + "/login",
                credentials
            );

            if (response.data && response.data.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('tokenType', response.data.tokenType);
                localStorage.setItem('tokenExpiry', (Date.now() + response.data.expiresIn * 1000).toString());
            }
            return response;
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                return error.response;
            }
            throw error;
        }
    }

    async logout(): Promise<AxiosResponse> {
        const logoutInfo: LogoutInfromation = {
            refreshToken: String(localStorage.getItem('refreshToken') || ""),
        };
        try {
            // Use public axios to avoid sending expired Bearer tokens in Authorization header
            const response = await axios.post<ResponseData<any>>(
                this.AUTHENTICATION_ROOT_URL + "/logout",
                logoutInfo
            );
            return response;
        } catch (error: any) {
            if (error.isAxiosError && error.response) {
                return error.response;
            }
            return {
                data: { message: "Logout completed locally" },
                status: 200,
                statusText: "OK",
                headers: {},
                config: {} as any,
            } as AxiosResponse;
        } finally {
            // Unconditionally purge authentication data from local storage
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("tokenType");
            localStorage.removeItem("tokenExpiry");
        }
    }
}

export default AccountSerice;
