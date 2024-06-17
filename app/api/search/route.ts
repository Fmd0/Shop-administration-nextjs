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
        const sortByParam = searchParams.get("sortByParam");
        if(sortByParam === "priceDesc") {
            sortBy = "price";
            sortBy = "desc";
        }
        else if(sortByParam === "priceAsc") {
            sortBy = "price";
            sort = "asc";
        }

        let some = {};
        const sizeParam = searchParams.get("size")||"";
        const colorParam = searchParams.get("color")||"";
        if(sizeParam !== "" && colorParam !== "") {
            some = {
                AND: [
                    {
                        skuConfigs: {
                            some: {
                                value: {
                                    has: sizeParam,
                                }
                            }
                        }
                    },
                    {
                        skuConfigs: {
                            some: {
                                value: {
                                    has: colorParam,
                                }
                            }
                        }
                    }
                ]
            }
        }
        else if(sizeParam !== "") {
            some = {
                skuConfigs: {
                    some: {
                        value: {
                            has: sizeParam
                        }
                    }
                }
            }
        }
        else if(colorParam !== "") {
            some = {
                skuConfigs: {
                    some: {
                        value: {
                            has: colorParam
                        }
                    }
                }
            }
        }


        const {_count: totalAmount} = await prisma.commodity.aggregate({
            where: {
                name: {
                    contains: query
                },
                ...onSale,
                // rating: {
                //     gt: rating,
                // },
                price: {
                    gte: startPrice,
                    lte: endPrice,
                },
                ...some
            },
            _count: true,
        })
        const totalPages = Math.ceil(totalAmount / pageSize);

        const data = await prisma.commodity.findMany({
            where: {
                name: {
                    contains: query
                },
                ...onSale,
                // rating: {
                //     gt: rating,
                // },
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

        return Response.json({msg: "Success", totalPages, totalAmount, data});
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