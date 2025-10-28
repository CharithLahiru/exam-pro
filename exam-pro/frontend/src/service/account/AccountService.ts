import Service from "../Service";
import type { AxiosResponse } from "axios";
import type { ResponseData } from "../../types/common/CommonTypes";
import type { AccountInformation, SignInInformation, AuthResponse } from "../../data/account/AccountInformation";

class AccountSerice extends Service{
    private abortController: AbortController;
    private readonly USER_ROOT_URL = "/account";
    private readonly AUTHENTICATION_ROOT_URL = "/api/auth";

    constructor(){
        super();
        this.abortController = new AbortController();
    }

    //TODO: this method is not useing. should be changed
    async getAccountInformation(userId: number,): Promise<AxiosResponse<ResponseData<AccountInformation>>> {
        try {
        const institutionResponse = await this.axiosPrivate.get<
            ResponseData<AccountInformation>
        >(`${this.USER_ROOT_URL}/getaccinfo${userId}`, {
            signal: this.abortController.signal,
        });

        return institutionResponse;
        } catch (error:any) {
        throw new error();
        }
    }

    async saveAccountInformation(accInfo: AccountInformation): Promise<AxiosResponse<ResponseData<AccountInformation>>> {
        try {
        const institutionResponse = await this.axiosPrivate.post<
            ResponseData<AccountInformation>
        >(this.USER_ROOT_URL+"/createuser", accInfo);

        return institutionResponse;
        } catch (error:any) {
        throw new error();
        }
    }

    async signIn(credentials: SignInInformation): Promise<AxiosResponse<ResponseData<AuthResponse>>> {
        try {
        const institutionResponse = await this.axiosPrivate.post<
            ResponseData<AuthResponse>
        >(this.AUTHENTICATION_ROOT_URL+"/login", credentials);

        localStorage.setItem('accessToken',institutionResponse.data.data.accessToken)
        localStorage.setItem('refreshToken',institutionResponse.data.data.refreshToken)
        localStorage.setItem('tokenType',institutionResponse.data.data.tokenType)
        localStorage.setItem('tokenExpiry',  (Date.now() + institutionResponse.data.data.expiresIn * 1000).toString() )
        return institutionResponse;
        } catch (error:any) {
            if (error.isAxiosError && error.response) {
            // Return the actual error response with status code
            return error.response;
            }
        throw new error();
        }
    }
}

export default AccountSerice;