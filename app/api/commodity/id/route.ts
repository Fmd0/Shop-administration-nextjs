import prisma from "@/utils/prisma";


const GET = async() => {
    try {
        const data = await prisma.commodity.findMany({
            select: {
                id: true,
                name: true,
                market: {
                    select: {
                        name: true,
                    }
                },
                skuConfigs: {
                    select: {
                        key: true,
                        value: true,
                        defaultValue: true,
                    }
                }
            },
        })
        return Response.json({msg: "Success", data})
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "GET commodity id error" }), {
            status: 500,
        })
    }
}


export {
    GET,
}