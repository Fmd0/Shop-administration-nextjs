

export interface MarketType {
    id: string,
    name: string,
    icon: string,
    rating?: string,
    ratingAmount?: string,
    description?: string,
    website?: string,
    email?: string,
    telephone?: string,
    facebook?: string,
    ins?: string,
    youtube?: string,
    address?: string,
    privacyPolicy?: string,
    refundPolicy?: string,
    shippingPolicy?: string,
}

export interface CommodityType {
    id: string,
    name: string,
    price: string,
    promotingPrice?: string,
    images: string[],
    rating?: string,
    ratingAmount?: string,
    description?: string,
    marketId?: string,
    market?: MarketType,
}

export interface MarketIdType {
    id: string,
    name: string,
}

export interface ImageInfoItem {
    image: File|null;
    imageUrl: string;
}

export const commodityType = [
    "name",
    "price",
    "promotingPrice",
    "images",
    "rating",
    "ratingAmount",
    "description",
]