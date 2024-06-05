import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { HomeShopStartedType} from "@/utils/type";


export const useHomeShopStarted = () => {
    const {data, error}:
        {data: {msg: string, data: HomeShopStartedType[]}, error: boolean|undefined}
        = useSWR("/api/home/started", fetcher);
    return {data, error};
}

export const mutateHomeShopStarted = () => {
    mutate("/api/home/started");
}