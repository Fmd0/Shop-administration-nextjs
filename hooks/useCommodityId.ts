import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {CommodityIdType} from "@/utils/type";


export const useCommodityId = () => {
    const {data, error}: {
        data: {msg: string, data: CommodityIdType[]},
        error: boolean|undefined
    } = useSWR("/api/commodity/id", fetcher);

    return {
        data,
        error
    }
}

export const mutateCommodityId = () => {
    mutate("/api/commodity/id");
}