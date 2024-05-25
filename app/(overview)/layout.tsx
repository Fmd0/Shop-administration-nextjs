'use client'
import {Breadcrumbs, Collapse, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import Image from "next/image";
import {ExpandLess, ExpandMore, Home, ShoppingBag, Store} from "@mui/icons-material";
import React, {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";


const Page = ({children}: {children: React.ReactNode}) => {

    const [homeOpen, setHomeOpen] = useState<boolean>(false);
    const [marketOpen, setMarketOpen] = useState<boolean>(false);
    const [commodityOpen, setCommodityOpen] = useState<boolean>(false);

    const pathname = usePathname();
    const pathArray = pathname.split("/");

    return (
        <div className="w-screen flex flex-row">
            <List sx={{
                width: "15%",
                minWidth: "250px",
                height: "100vh",
                overflow: "auto",
            }}
            >

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
                    <ListItemText>主页配置</ListItemText>
                    {homeOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={homeOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemText inset primary="轮播图配置"/>
                        </ListItemButton>
                    </List>
                </Collapse>


                {/*商家配置*/}
                <ListItemButton onClick={() => setMarketOpen(m => !m)}>
                    <ListItemIcon><Store/></ListItemIcon>
                    <ListItemText>商家配置</ListItemText>
                    {marketOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={marketOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/market/info">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/market/info"}>
                                <ListItemText inset primary="商家信息配置" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>


                {/*商品配置*/}
                <ListItemButton onClick={() => setCommodityOpen(m => !m)}>
                    <ListItemIcon><ShoppingBag/></ListItemIcon>
                    <ListItemText>商品配置</ListItemText>
                    {commodityOpen?<ExpandLess/> :<ExpandMore/>}
                </ListItemButton>
                <Collapse in={commodityOpen} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <Link href="/commodity/info">
                            <ListItemButton sx={{ pl: 4 }} selected={pathname==="/commodityOpen/info"}>
                                <ListItemText inset primary="商品信息配置" />
                            </ListItemButton>
                        </Link>
                    </List>
                </Collapse>



            </List>


            <div className="flex-1 overflow-auto no-scrollbar">
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