import prisma from "@/utils/prisma";


const GET = async () => {
    try {
        const data = await prisma.market.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        return Response.json({
            msg: "Success",
            data
        });
    }
    catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ msg: "GET market error" }), {
            status: 500,
        });
    }
}

export {
    GET,
}