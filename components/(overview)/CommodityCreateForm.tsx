
import {Alert, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import {Dispatch, SetStateAction } from "react";
import {commodityType, ImageInfoItem} from "@/utils/type";
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {useMarketId} from "@/hooks/useMarketId";

const CommodityCreateForm = ({open, onClose, images, setImages, handleSubmit, createStatus}: {
    open: boolean,
    onClose: () => void,
    images: ImageInfoItem[],
    setImages: Dispatch<SetStateAction<ImageInfoItem[]>>,
    handleSubmit: (formData: FormData) => Promise<void>,
    createStatus: string,
}) => {

    const {data, error} = useMarketId();

    if(error) {
        console.log(error);
        return null;
    }


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <form action={handleSubmit} className="relative">
                <DialogTitle>新增商品</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-3 gap-8 p-4">
                        {
                            commodityType.map(c => {
                                if(c === "name") {
                                    return <TextField key={c} variant="outlined" size="small" name={c} required label={c} id={c}/>
                                }
                                return <TextField key={c} variant="outlined" size="small" name={c} label={c} id={c}/>;
                            })
                        }
                    </div>
                </DialogContent>
                <DialogTitle>设置商品图片</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-3 items-center gap-8 p-4">
                        {
                            images.map((image,i) => (

                                // 单项
                                <div key={i} className="grid grid-cols-3 gap-8 items-center">

                                    {/*左侧按钮*/}
                                    <Button component="label" variant="contained">
                                        <input type="file" className="opacity-0 w-1"
                                               accept="image/*"
                                               onChange={(event) => {
                                                   setImages(
                                                       images.map((image,imageIndex) => imageIndex === i?
                                                           {
                                                             image: event.currentTarget.files?.[0]||null,
                                                             imageUrl: "",
                                                           }: image
                                                   ))
                                               }}/>
                                        选择图片
                                    </Button>

                                    {/*中间图片*/}
                                    <div>
                                        {image.image&&
                                            <img src={URL.createObjectURL(image.image)} alt="logo"
                                                 className="object-cover"
                                            />
                                        }
                                    </div>

                                    {/*右边按钮*/}
                                    <div className="grid grid-rows-2 gap-1 items-center">
                                        <Button size="small" variant="outlined" onClick={() => {
                                            setImages(images => images.filter((image, imageIndex) => {
                                                return imageIndex !== i;
                                            }) )
                                        }}>
                                            取消图片
                                        </Button>
                                        {!image.image?null:(image.imageUrl===""||image.imageUrl==="pending")?
                                            <Button size="small" variant="outlined"
                                                    disabled={image.imageUrl === "pending"}
                                                    onClick={async () => {
                                                        const formData = new FormData();
                                                        if(image.image) {
                                                            formData.append("file", image.image);
                                                        }
                                                        formData.append("upload_preset", "omkl1g94");
                                                        // console.log(Object.fromEntries(formData));
                                                        setImages(images =>
                                                            images.map((image,imageIndex) => imageIndex === i?{...image, imageUrl:"pending"}:image
                                                        ))
                                                        fetch("https://api.cloudinary.com/v1_1/dhfot9vkw/image/upload", {
                                                            method: "POST",
                                                            body: formData,
                                                        })
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                console.log(data);
                                                                setImages(images =>
                                                                    images.map((image,imageIndex) => imageIndex===i?{...image, imageUrl:data?.secure_url}:image))
                                                            })
                                                            .catch(err => console.log(err));
                                                    }
                                            }>
                                                {image.imageUrl === "pending"?"处理中":"确认使用"}
                                            </Button>:
                                            <div className="text-[13px]">
                                                <CheckCircleOutlineOutlinedIcon fontSize="small" color="success" />
                                                已成功上传
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        <Button size="large" variant="contained" onClick={() => setImages(i=> [...i,{image: null, imageUrl: ""}] )}>增加图片</Button>
                    </div>
                    <p className="mt-10 pl-2 flex items-center">
                        <InfoIcon color="action" />
                        点击确认使用后图片将会被上传至云端
                    </p>
                </DialogContent>
                <DialogActions sx={{ pr: 4, pb: 4 }}>
                    <Button type="submit" variant="contained"
                            disabled={createStatus === "pending"}
                    >新增</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CommodityCreateForm;