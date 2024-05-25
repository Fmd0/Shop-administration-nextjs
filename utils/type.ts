

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

export interface ImageInfoItem {
    image: File|null;
    imageUrl: string;
}

export const commodityType = [
    "name",
    "rating",
    "ratingAmount",
    "description",
]