import useSWR, { mutate } from "swr"
import fetcher from "@/utils/fetcher";
import {CommodityType} from "@/utils/type";


const useCommodity = (page: number, query: string, marketId: string="") => {
    const {data, error}: {
        data: {msg: string, totalPages: number, totalAmount: number, data: CommodityType[]},
        error: boolean|undefined,
    } = useSWR(`/api/commodity?page=${page}&query=${query}&marketId=${marketId}`, fetcher);
    return {
        data,
        error
    }
}

const mutateCommodity = (page: number, query: string, marketId: string="") => {
    mutate(`/api/commodity?page=${page}&query=${query}&marketId=${marketId}`);
}

export {
    useCommodity,
    mutateCommodity
}