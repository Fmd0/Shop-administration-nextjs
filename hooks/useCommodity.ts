import useSWR, { mutate } from "swr"
import fetcher from "@/utils/fetcher";
import {CommodityType} from "@/utils/type";


const useCommodity = () => {
    const {data, error, isLoading}: {
        data: {msg: string, data: CommodityType[]},
        error: boolean|undefined,
        isLoading: boolean,
    } = useSWR("/api/commodity", fetcher);
    return {
        data,
        isLoading,
        error
    }
}

const mutateCommodity = () => {
    mutate("/api/commodity");
}

export {
    useCommodity,
    mutateCommodity
}