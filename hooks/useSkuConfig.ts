import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {SkuConfigType} from "@/utils/type";


export const useSkuConfig = (page: number, commodityId: string) => {
    const {data, error}: {
        data: {msg: string, totalPages: number, totalAmount: number, data: SkuConfigType[]},
        error: boolean|undefined
    } = useSWR(`/api/sku/config?page=${page}&commodityId=${commodityId}`, fetcher);

    return {data, error};
}

export const mutateSkuConfig = (page: number, commodityId: string) => {
    mutate(`/api/sku/config?page=${page}&commodityId=${commodityId}`);
}