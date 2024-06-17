import prisma from "@/utils/prisma";


const GET = async(_: Request) => {
    try {
        const data = await prisma.skuItem.findMany({
            select: {
                id: true,
                sku: true,
                commodity: {
                    select: {
                        name: true,
                        market: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        })

        return Response.json({msg: 'Success', data})
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({msg: "GET skuItem id error" }), {
            status: 500,
        })
    }
}

export {
    GET,
}