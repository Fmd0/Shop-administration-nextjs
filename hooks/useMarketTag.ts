import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {MarketTagType} from "@/utils/type";


export const useMarketTag = () => {
    const {data, error}:
        {data: {msg: string, data: MarketTagType[]}, error: boolean|undefined}
        = useSWR("/api/market/tag", fetcher);
    return {data, error};
}

export const mutateMarketTag = () => {
    mutate("/api/market/tag");
}