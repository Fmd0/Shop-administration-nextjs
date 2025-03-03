
import {Alert, Button,
    Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material";
import {Dispatch, SetStateAction, useEffect, useState } from "react";
import {CommodityType} from "@/utils/type";
import InfoIcon from '@mui/icons-material/Info';
import OptionalImageItem from "@/components/(overview)/commodity/OptionalImageItem";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { v4 as uuidV4 } from 'uuid';
import {useMarketTag} from "@/hooks/useMarketTag";


const CommodityCreateDialog = ({open, onClose, handleSubmit, updateInfo, images, setImages, updateStatus, failMsg}: {
    open: boolean,
    onClose: () => void,
    handleSubmit: (formData: FormData) => Promise<void>,
    updateInfo: CommodityType|null,
    updateStatus: string,
    failMsg: string,
    images: {key: string,value: string}[],
    setImages: Dispatch<SetStateAction<{key: string,value: string}[]>>,
}) => {

    const {data: marketTagData={msg: "", data: []}, error: marketTagError} = useMarketTag();
    const [tagList, setTagList] = useState<string[]>([]);

    useEffect(() => {
        setTagList(marketTagData.data.find(m => m.market.id === updateInfo?.market?.id)?.tags||[]);
    }, [updateInfo]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <form action={handleSubmit} className="relative">
                <DialogTitle>更新商品</DialogTitle>
                <Collapse in={updateStatus==="success"} className="absolute top-2 left-1/2 -translate-x-1/2">
                    <Alert severity="success">更新成功</Alert>
                </Collapse>
                <Collapse in={updateStatus==="error"} className="absolute top-2 left-1/2 -translate-x-1/2">
                    <Alert severity="error">更新失败 失败原因：{failMsg}</Alert>
                </Collapse>

                <DialogContent>
                    <div className="grid grid-cols-3 gap-8 p-4">

                        {/*只展示不允许被修改的market字段*/}
                        <TextField variant="outlined"
                                   size="small"
                                   defaultValue={updateInfo?.market?.name}
                                   label="market"
                                   id="market"
                                   InputProps={{
                                       readOnly: true,
                                   }}
                        />


                        {/*剩余字段*/}
                        {updateInfo&&
                            Object.entries(updateInfo).map(([k,v]) => {
                                if(k === "id" || k === "images" || k === "marketId" || k === "market" || k === "tags") {
                                    return null;
                                }
                                return <TextField key={k}
                                                  variant="outlined"
                                                  size="small"
                                                  name={k}
                                                  defaultValue={v}
                                                  required={k==="name"}
                                                  label={k}
                                                  id={k}
                                />
                            })
                        }
                    </div>
                </DialogContent>

                {
                    tagList.length>0 &&
                    <DialogContent>
                        <div className="grid grid-cols-10 gap-2 p-4">
                            {
                                tagList.map(t => (
                                    <FormControlLabel key={t} control={<Checkbox defaultChecked={updateInfo?.tags?.includes(t)}/>} label={t} name="tag" value={t}/>
                                ))
                            }
                        </div>
                    </DialogContent>
                }


                {/*商品图片列表 可变长度*/}
                <DialogTitle>设置商品图片</DialogTitle>
                <DialogContent>
                    <div className="grid grid-cols-3 items-center gap-8 p-4">
                        {
                            images.map((image) => (
                                <div key={image.key} className="relative">
                                    <OptionalImageItem initialUrl={image.value} inputName="images"/>
                                    <CancelOutlinedIcon className="absolute cursor-pointer w-6 top-0 right-0 -translate-y-[calc(50%+4px)] translate-x-1/2" color="action"
                                                        onClick={() => setImages(images.filter(i => i.key !== image.key))}
                                    />
                                </div>
                            ))
                        }
                        <Button size="large" variant="contained"
                                onClick={() => setImages([...images, {key: uuidV4(), value: ""}])}
                        >
                            增加图片
                        </Button>
                    </div>
                    <p className="mt-10 pl-2 flex items-center">
                        <InfoIcon color="action"/>
                        点击确认使用后图片将会被上传至云端，新增商品前确保所有图片都被上传至云端
                    </p>
                </DialogContent>
                <DialogActions sx={{pr: 4, pb: 4}}>
                <Button type="submit" variant="contained"
                            disabled={updateStatus === "pending"}
                    >更新</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default CommodityCreateDialog;