import Service from "../Service";
import type { AxiosResponse } from "axios";
import type { ResponseData } from "../../types/common/CommonTypes";
import type { AccountInformation } from "../../data/account/AccountInformation";

class AccountSerice extends Service{
    private abortController: AbortController;
    private readonly ACCCOUNT_INFORMATION_ROOT_URL = "/account";

    constructor(){
        super();
        this.abortController = new AbortController();
    }

    async getAccountInformation(userId: number,): Promise<AxiosResponse<ResponseData<AccountInformation>>> {
        try {
        const institutionResponse = await this.axiosPrivate.get<
            ResponseData<AccountInformation>
        >(`${this.ACCCOUNT_INFORMATION_ROOT_URL}/getaccinfo${userId}`, {
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
        >(this.ACCCOUNT_INFORMATION_ROOT_URL, accInfo);

        return institutionResponse;
        } catch (error:any) {
        throw new error();
        }
    }
}

export default AccountSerice;