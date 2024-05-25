
// const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     secure: true,
//     cloud_name: "dhfot9vkw",
//     api_key: "927675165541135",
//     api_secret: "J5GoQh-3-UGnGNI7WyJyTbSSbAg",
// });


// const test = async () => {
//     try {
//         // const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg");
//         const uploadResult = await cloudinary.uploader.upload("/Users/tianzhanzhan/Desktop/图片1/11_副本.svg");
//         console.log(uploadResult);
//     }
//     catch (error) {
//         console.log(error);
//     }
//
// }



const z = require("zod");

const obj = z.object({
    name: z.string().min(3).max(100),
    email: z.coerce.number(),
    }
)

const result = obj.safeParse({
    name: "123",
})

if(result.success) {
    console.log(result.data);
}
else {
    console.log(result.error.flatten().fieldErrors);
}













