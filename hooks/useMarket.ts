import useSWR, {mutate} from "swr";
import fetcher from "@/utils/fetcher";


const useMarket = () => {
    const {data, isLoading, error} = useSWR("/api/market", fetcher);
    return {
        data,
        isLoading,
        error
    }
}

const mutateMarket =  async () => {
     await mutate("/api/market");
}

export {
    useMarket,
    mutateMarket
};