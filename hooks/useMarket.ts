import useSWR, {mutate} from "swr";
import fetcher from "@/utils/fetcher";
import {MarketType} from "@/utils/type";


const useMarket = (page: number, query: string) => {
    const {data, error}: {
        data: {msg: string, totalPages: number, data: MarketType[]},
        error: boolean|undefined
    } = useSWR(`/api/market?page=${page}&query=${query}`, fetcher);
    return {
        data,
        error
    }
}

const mutateMarket =  (page: number, query: string) => {
    mutate(`/api/market?page=${page}&query=${query}`);
}

export {
    useMarket,
    mutateMarket
};