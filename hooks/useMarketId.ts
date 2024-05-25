import useSWR, {mutate} from "swr";
import fetcher from "@/utils/fetcher";


const useMarketId = () => {
    const {data, isLoading, error} = useSWR("/api/market/id", fetcher);
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