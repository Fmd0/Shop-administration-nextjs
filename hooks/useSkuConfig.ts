import fetcher from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {SkuConfigType} from "@/utils/type";


export const useSkuConfig = () => {
    const {data, error}: {
        data: {msg: string, data: SkuConfigType[]},
        error: boolean|undefined
    } = useSWR("/api/sku/config", fetcher);

    return {data, error};
}

export const mutateSkuConfig = () => {
    mutate("/api/sku/config");
}