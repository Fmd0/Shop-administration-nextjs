import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {SkuItemType} from "@/utils/type";


export const useSkuItem = (page: number, commodityId: string) => {
    const {data, error}: {
        data: {msg: string, totalAmount: number, totalPages: number, data: SkuItemType[]},
        error: boolean|undefined
    } = useSWR(`/api/sku/item?page=${page}&commodityId=${commodityId}`, fetcher);

    return {data, error};
}

export const mutateSkuItem = (page: number, commodityId: string) => {
    mutate(`/api/sku/item?page=${page}&commodityId=${commodityId}`);
}