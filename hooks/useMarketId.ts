import useSWR, {mutate} from "swr";
import fetcher from "@/utils/fetcher";
import {MarketIdType} from "@/utils/type";


const useMarketId = () => {
    const {data, isLoading, error}: {
        data: {msg: string, data: MarketIdType[]},
        isLoading: boolean,
        error: boolean|undefined
    } = useSWR("/api/market/id", fetcher);
    return {
        data,
        isLoading,
        error
    }
}

const mutateMarketId =  async () => {
     await mutate("/api/market/id");
}

export {
    useMarketId,
    mutateMarketId
};