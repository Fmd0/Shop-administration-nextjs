import useSWR, { mutate } from "swr"
import fetcher from "@/utils/fetcher";
import {CommodityType} from "@/utils/type";


const useCommodity = (page: number, query: string) => {
    const {data, error}: {
        data: {msg: string, totalPages: number, data: CommodityType[]},
        error: boolean|undefined,
    } = useSWR(`/api/commodity?page=${page}&query=${query}`, fetcher);
    return {
        data,
        error
    }
}

const mutateCommodity = (page: number, query: string) => {
    mutate(`/api/commodity?page=${page}&query=${query}`);
}

export {
    useCommodity,
    mutateCommodity
}