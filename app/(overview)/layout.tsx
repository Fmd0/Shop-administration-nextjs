'use client'
import {Breadcrumbs, Collapse, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import Image from "next/image";
import {ExpandLess, ExpandMore, Home, ShoppingBag, Store, ModeComment, Class, TurnedIn} from "@mui/icons-material";
import React, {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const Page = ({children}: {children: React.ReactNode}) => {

    const [homeOpen, setHomeOpen] = useState<boolean>(false);
    const [marketOpen, setMarketOpen] = useState<boolean>(false);
    const [commodityOpen, setCommodityOpen] = useState<boolean>(false);
    const [skuOpen, setSkuOpen] = useState<boolean>(false);
    const [commentOpen, setCommentOpen] = useState<boolean>(false);
    const [categoryOpen, setCategoryOpen] = useState<boolean>(false);

    const pathname = usePathname();
    const pathArray = pathname.split("/");

    return (
        <div className="w-screen flex flex-row">
            <List className="w-[15%]">

                {/*logo*/}
                <Link href="/">
                    <ListItemButton sx={{
                        pb: "16px",
                    }}>
                        <ListItemText inset>
                                <Image priority src="/logo.svg" alt="logo" width={101} height={42} className="w-20" />
                        </ListItemText>
                    </ListItemButton>
                </Link>


                {/*主页配置*/}
                <ListItemButton onClick={() => setHomeOpen(h => !h)}>
                    <ListItemIcon><Home/></ListItemIcon>
                    <ListItemText>Homepage</ListItemText>
                    {homeOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={homeOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/home/banner">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/home/banner"}>
                                <ListItemText inset primary="home banner" />
                            </ListItemButton>
                        </Link>
                        <Link href="/home/started">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/home/started"}>
                                <ListItemText inset primary="home started" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>


                {/*商家配置*/}
                <ListItemButton onClick={() => setMarketOpen(m => !m)}>
                    <ListItemIcon><Store/></ListItemIcon>
                    <ListItemText>Market</ListItemText>
                    {marketOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={marketOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/market/info">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/market/info"}>
                                <ListItemText inset primary="market info" />
                            </ListItemButton>
                        </Link>
                        <Link href="/market/tag">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/market/tag"}>
                                <ListItemText inset primary="market tag" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>


                {/*商品配置*/}
                <ListItemButton onClick={() => setCommodityOpen(m => !m)}>
                    <ListItemIcon><ShoppingBag/></ListItemIcon>
                    <ListItemText>Commodity</ListItemText>
                    {commodityOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={commodityOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/commodity/info">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/commodity/info"}>
                                <ListItemText inset primary="commodity info" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>


                {/*sku配置*/}
                <ListItemButton onClick={() => setSkuOpen(m => !m)}>
                    <ListItemIcon><TurnedIn/></ListItemIcon>
                    <ListItemText>Sku</ListItemText>
                    {skuOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={skuOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/sku/config">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/sku/config"}>
                                <ListItemText inset primary="sku config" />
                            </ListItemButton>
                        </Link>
                        <Link href="/sku/item">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/sku/item"}>
                                <ListItemText inset primary="sku item" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>

                {/*comment配置*/}
                <ListItemButton onClick={() => setCommentOpen(m => !m)}>
                    <ListItemIcon><ModeComment/></ListItemIcon>
                    <ListItemText>Comment</ListItemText>
                    {commentOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={commentOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/comment/info">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/comment/info"}>
                                <ListItemText inset primary="comment info" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>


                {/*category 配置*/}
                <ListItemButton onClick={() => setCategoryOpen(!categoryOpen)}>
                    <ListItemIcon><Class/></ListItemIcon>
                    <ListItemText>Category</ListItemText>
                    {categoryOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={categoryOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/category/config">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/category/config"}>
                                <ListItemText inset primary="category config" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>


            </List>


            <div className="flex-1 w-[85%]">
                <header className="p-4">
                    <Breadcrumbs>
                        <p>Home</p>
                        {
                            pathArray.map((p, index) => (
                                p===""?null:<p key={index}>{p}</p>
                            ))
                        }
                    </Breadcrumbs>
                    <p className="text-[36px] capitalize">{pathArray[pathArray.length-1]}</p>
                </header>
                <main className="p-4">
                    {children}
                </main>
            </div>

        </div>
    )
}

export default Page;