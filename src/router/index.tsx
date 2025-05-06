import { RouteObject } from "react-router-dom";
import Home from "../pages/home";
import React
 from "react";
export interface extraBizObject {
    title?: string;
}

export type ZHRouter = Array<RouteObject & extraBizObject>;

export const router: ZHRouter = [
    {
        path: "/", element: <Home />, title:"数独游戏",
    },
   
]