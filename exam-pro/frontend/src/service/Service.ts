import type { AxiosInstance } from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate"

class Service {
    protected axiosPrivate: AxiosInstance;
    constructor() {
        this.axiosPrivate = useAxiosPrivate();
    }
}
export default Service;