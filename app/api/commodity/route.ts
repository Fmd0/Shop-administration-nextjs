import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";



const POST = async (req: NextRequest) => {
    // const formData = await req.formData();
    // for(const [k,v] of formData) {
    //     console.log(k,v);
    // }
    // const data = await prisma.commodity.create({
    //     data: {
    //         name: "test",
    //         images: ["abc", "cdf"],
    //     }
    // })

    // const data = await prisma.market.update({
    //     where: {
    //         id: "665075154ff066194d9f22f3"
    //     },
    //     data: {
    //         commodities: {
    //             connect: {
    //                 id: "6651d88dc93eff5c63e53b15"
    //             }
    //         }
    //     }
    // })

    return Response.json({});
}

export {
    POST,
}