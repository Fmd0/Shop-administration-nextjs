import prisma from "@/utils/prisma";

const GET = async(req: Request) => {
    try {
        const searchParams = new URLSearchParams(new URL(req.url).search);
        const page = Number(searchParams.get("page")) || 1;
        const pageSize = Number(searchParams.get("pageSize")) || 6;
        const query = searchParams.get("query") || "";

        const onSaleParam = searchParams.get("onSale");
        let onSale = {};
        if (onSaleParam!==null && onSaleParam!=="") {
            onSale = {
                promotingPrice: {
                    gt: 0,
                },
            }
        }

        const rating = Number(searchParams.get("rating"))||0;
        const startPrice = Number(searchParams.get("startPrice"))||0;
        const endPrice = Number(searchParams.get("endPrice"))||200000;

        let sortBy = "createdAt";
        let sort = "desc";
        const sortByParam = searchParams.get("sortBy");
        if(sortByParam === "newest") {
            sort = "asc"
        }
        else if(sortByParam === "bestSelling") {
            sortBy = "selling";
            sort = "desc";
        }
        else if(sortByParam === "priceDesc") {
            sortBy = "price";
            sort = "desc";
        }
        else if(sortByParam === "priceAsc") {
            sortBy = "price";
            sort = "asc";
        }


        let some = {};
        const sizeParam = searchParams.getAll("size");
        const colorParam = searchParams.getAll("color");
        if(sizeParam.length!==0 && colorParam.length !== 0) {
            some = {
                AND: [
                    {
                        skuConfigs: {
                            some: {
                                value: {
                                    hasSome: sizeParam,
                                }
                            }
                        }
                    },
                    {
                        skuConfigs: {
                            some: {
                                value: {
                                    hasSome: colorParam,
                                }
                            }
                        }
                    }
                ]
            }
        }
        else if(sizeParam.length!==0) {
            some = {
                skuConfigs: {
                    some: {
                        value: {
                            hasSome: sizeParam
                        }
                    }
                }
            }
        }
        else if(colorParam.length !== 0) {
            some = {
                skuConfigs: {
                    some: {
                        value: {
                            hasSome: colorParam
                        }
                    }
                }
            }
        }


        const {_count: totalAmount} = await prisma.commodity.aggregate({
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                ...onSale,
                rating: {
                    gte: rating,
                },
                price: {
                    gte: startPrice,
                    lte: endPrice,
                },
                ...some,
            },
            _count: true,
        })
        const totalPages = Math.ceil(totalAmount / pageSize);
        const hasMore = totalAmount> page*pageSize;
        console.log(totalAmount);

        const data = await prisma.commodity.findMany({
            select: {
                id: true,
                name: true,
                images: true,
                rating: true,
                ratingAmount: true,
                price: true,
                promotingPrice: true,
            },
            where: {
                name: {
                    contains: query,
                    mode: "insensitive",
                },
                ...onSale,
                rating: {
                    gte: rating,
                },
                price: {
                    gte: startPrice,
                    lte: endPrice,
                },
                ...some,
            },
            orderBy: {
              [sortBy]: sort,
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })

        return Response.json({msg: "Success", totalPages, hasMore, totalAmount, data}, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Method": "GET",
            }
        });
    }
    catch(err) {
        console.log(err);
        return Response.json({msg: "GET search error"}, {
            status: 500,
        })
    }
}


export {
    GET,
}