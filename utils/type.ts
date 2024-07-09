

export interface MarketType {
    id: string,
    name: string,
    icon: string,
    bigLogo?: string,
    bigLogoBgColor?: string,
    bigLogoFontColor?: string,
    bigPic?: string,
    bigVideo?: string,
    rating?: string,
    ratingAmount?: string,
    description?: string,
    website?: string,
    email?: string,
    telephone?: string,
    facebook?: string,
    twitter?: string,
    ins?: string,
    youtube?: string,
    address?: string,
    privacyPolicy?: string,
    refundPolicy?: string,
    shippingPolicy?: string,

    marketTag?: MarketTagType
}

export interface CommodityType {
    id: string,
    name: string,
    price: number,
    promotingPrice?: number,
    images: string[],
    rating?: number,
    ratingAmount?: string,
    description?: string,
    stock?: number,
    selling?: number,
    officialLink?: string,
    tags?: string[],
    marketId?: string,
    market?: MarketType,
}

export interface SkuConfigType {
    id: string,
    key: string,
    defaultValue: string,
    value: string[],
    commodityId?: string,
    commodity?: CommodityType
}

export interface SkuItemType {
    id: string,
    sku: {
        [key: string]: string,
    },
    price: number,
    promotingPrice: number,
    image?: string,
    stock: number,
    commodityId?: string,
    commodity?: CommodityType
}

export interface CommodityIdType {
    id: string,
    name: string,
    market: {
        name: string,
    },
    skuConfigs: {
        key: string,
        value: string[],
        defaultValue: string,
    }[]
}

export interface HomeBannerType {
    id: string,
    image: string,
    logo?: string,
    isCommodity: boolean,
    row: "ROW0"|"ROW1"|"ROW2",
    relativeId: string,
}

export interface HomeShopStartedType {
    id: string,
    name: string,
    logo: string,
    imageLeft?: string,
    imageRight?: string,
    rating?: string,
    ratingAmount?: string,
    relativeId: string,
}

export interface MarketTagType {
    id: string,
    tags: string[],
    market: {
        id: string,
        name: string,
    }
}

export interface CommentType {
    id: string,
    rating: number,
    comment: string,
    userName: string,
    marketId: string,
    commodityId: string,
    market: MarketType,
    commodity: CommodityType,
}

export interface MarketIdType {
    id: string,
    name: string,
}

export interface ImageInfoItem {
    image: File|null;
    imageUrl: string;
}

export interface CategoryType {
    id: string,
    categoryId: number,
    name: string,
    children: CategoryType[],
    parentId: string,
    parent?: CategoryType,
}

export const commodityType = [
    "id",
    "name",
    "price",
    "promotingPrice",
    "images",
    "rating",
    "ratingAmount",
    "description",
    "stock",
    "selling",
    "officialLink",
    "tags",
]