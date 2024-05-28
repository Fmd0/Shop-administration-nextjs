import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {SkuItemType} from "@/utils/type";


export const useSkuItem = () => {
    const {data, error}: {
        data: {msg: string, data: SkuItemType[]},
        error: boolean|undefined
    } = useSWR("/api/sku/item", fetcher);

    return {data, error};
}

export const mutateSkuItem = () => {
    mutate("/api/sku/item");
}