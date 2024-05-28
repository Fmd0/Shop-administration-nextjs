import { Button } from "@mui/material";
import {useEffect, useState } from "react";
import {ImageInfoItem} from "@/utils/type";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';


const OptionalImageItem = ({initialUrl, inputName}: {
    initialUrl: string,
    inputName: string,
}) => {

    const [image, setImage] = useState<ImageInfoItem>({
        image: null,
        imageUrl: "",
    });

    useEffect(() => {
        setImage({
            image: null,
            imageUrl: initialUrl,
        })
    }, [initialUrl]);


    const handleUpload = () => {
        const formData = new FormData();
        if (image.image) {
            formData.append("file", image.image);
        }
        formData.append("upload_preset", "omkl1g94");
        setImage({
            ...image,
            imageUrl: "pending",
        })
        fetch("https://api.cloudinary.com/v1_1/dhfot9vkw/image/upload", {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setImage({
                    ...image,
                    imageUrl: data.secure_url||""
                })
            })
            .catch(err => console.log(err));
    }

    // console.log(image);

    return (
        <div className="grid grid-cols-3 gap-8 items-center">

            {/*左侧按钮 选择图片*/}
            <Button component="label" variant="contained">
                <input type="hidden" name={inputName}
                       defaultValue={image.imageUrl==="pending" ? "" : image.imageUrl} />
                <input type="file" className="opacity-0 w-1"
                       accept="image/*"
                       onChange={(event) => {
                           setImage({
                               image: event.target.files?.[0]||null,
                               imageUrl: "",
                           });
                       }} />
                选择图片
            </Button>

            {
                image.image === null && image.imageUrl !== "" && image.imageUrl !== "pending" &&
                (
                    <>
                        <img src={image.imageUrl} alt="logo"
                             className="max-w-20 max-h-20 object-cover"
                        />
                        <p>云端已上传</p>
                    </>
                )
            }

            {/*中间图片*/}
            <div>
                {image.image &&
                    <img src={URL.createObjectURL(image.image)} alt="logo"
                         className="max-w-20 max-h-20 object-cover"
                    />
                }
            </div>

            {/*右边控价 上传和上传状态展示*/}

            {!image.image ? null : (image.imageUrl === "" || image.imageUrl === "pending") ?
                <Button size="small" variant="outlined"
                        disabled={image.imageUrl === "pending"}
                        onClick={handleUpload}>
                    {image.imageUrl === "pending" ? "处理中" : "确认使用"}
                </Button> :
                <div className="text-[13px]">
                    <CheckCircleOutlineOutlinedIcon fontSize="small" color="success"/>
                    已成功上传
                </div>
            }
        </div>
    )
}


export default OptionalImageItem;