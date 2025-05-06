// @ts-ignore
import { useContext, useState } from 'react';
import Block from './components/Block';
import ToolBox from './components/ToolBox';
import './index.less';
import React from 'react';
import {produce} from "immer";
import { dataType } from './interface';
import { Button, Modal } from "antd";
// import { blockData } from './utils';

// import './index.module.scss'
const blockArray = new Array(3).fill(new Array(3).fill({
    data: new Array(3).fill(new Array(3).fill({ data: '', isActive: false })),
    isActive: false
}))
// console.log({blockArray})
export const BlockDataContext = React.createContext(null);

export const DataContext = React.createContext(null)

const ShuDu = () => {
    const [modal] = Modal.useModal();

    const[chessboard, setChessBoard] = useState(blockArray);
    const [compareGroup, setCompareGroup] = useState<dataType[]>([]);
    const [outerBlockInfo, setOuterBlockInfo] = useState<number[]>([]);
    const [innerBlockInfo, setInnerBlockInfo] = useState<number[]>([]);

    // 初始化
    const init = () => {
        // 恢复数据的初始状态
        setChessBoard(blockArray)
        setCompareGroup([])
        setOuterBlockInfo([])
        setInnerBlockInfo([])
    }

    // 更新 UI 
    const getActiveBlockData = (
        outerBlockInfo: number[], // 二维数组
    ) => {
        return function (innerBlockInfo: number[]) { 
            // 保存上下文
            setOuterBlockInfo(outerBlockInfo)
            setInnerBlockInfo(innerBlockInfo)

            // 清空棋盘 ---- 清除之前保留的上下文
            setChessBoard(produce((draft) => {
                // active 状态清空
                for(let i = 0; i < draft.length; i ++) {
                    for (let j = 0; j < draft[i].length; j++) {
                        const data = draft[i][j].data;
                        draft[i][j].isActive = false;
                        for (let m = 0; m < data.length; m ++) {
                            for (let n = 0; n < data[m].length; n ++) {
                                data[m][n].isActive = false;
                            }
                        }

                    }
                }
            }))

            // 清空 比较队列
            setCompareGroup([])

            // 激活需要高亮的内容 同时生成比较队列
            setChessBoard(produce((draft) => {
                const outerX = outerBlockInfo[0];
                const outerY = outerBlockInfo[1];
                const innerX = innerBlockInfo[0];
                const innerY = innerBlockInfo[1];
                const tempData = [];
                

                // 当前方格变色 及所在大方格变色
                draft[outerX][outerY].isActive = true;
                const  currentDataGroup = draft[outerX][outerY].data
                for (let i = 0; i < currentDataGroup.length; i ++) {
                    for(let j = 0; j < currentDataGroup[i].length; j ++) {
                        console.log({currentDataGroup: currentDataGroup[i][j].data})
                        if (currentDataGroup[i][j].data) {
                            tempData.push(currentDataGroup[i][j].data);
                        }
                    }
                }

                // 当前方格内容 变色
                draft[outerX][outerY].data[innerX][innerY].isActive = true;

                
                // console.log(JSON.stringify(draft, null, " "));
                // console.log(JSON.stringify(draft));
                // 其他方格对应的行列变色
                const direction = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                // 遍历四个方向
                for (let i = 0; i < direction.length; i++) {
                    const dx = direction[i][0];
                    const dy = direction[i][1];

                    // 先找 大方框
                    let newOuterX = outerX + dx;
                    let newOuterY = outerY + dy;
                    
                    // 在找小格子
                    let newInnerX = innerX;
                    let newInnerY = innerY;
                    // console.log({dx, dy})
                    while((newOuterX >= 0 && newOuterX <=2) && (newOuterY >= 0 && newOuterY <=2)) {
                        // 符合条件的行/列的所有值
                        if (dx !== 0) { // 横向走
                            for (let x = 0; x <= 2; x ++) {
                                draft[newOuterX][newOuterY].data[x][newInnerY].isActive = true;
                                const currentData = draft[newOuterX][newOuterY].data[x][newInnerY].data;
                                if (currentData) {
                                    tempData.push(currentData)
                                }
                                
                            }
                        }

                        if (dy !== 0) { // 纵向走
                            for (let y = 0; y <= 2; y ++) {
                                // console.log({newInnerX})
                                draft[newOuterX][newOuterY].data[newInnerX][y].isActive = true;
                                const currentData = draft[newOuterX][newOuterY].data[newInnerX][y].data;
                                if (currentData) {
                                    tempData.push(currentData)
                                }
                            }
                        }
                        setCompareGroup(tempData)
                        console.log({tempData})

                        // 大盒子先动
                        newOuterX += dx;
                        newOuterY += dy;
                        // console.log({newOuterX, newOuterY})
                        // console.log("================================")
                    }
                }
            }))
        }
    }

    // 填写数字
    const fillBlock = (num: number) => {
        setChessBoard(produce((draft) => {
            let flag = true;
            for (let i = 0; i < compareGroup.length; i ++) {
                if (num === Number(compareGroup[i])) {
                    flag = false; // 有重复数据
                }
            }

            // 判断数据内容是否 符合数独游戏要求
            if (!flag) { // 游戏结束
                Modal.error({
                    title: "游戏结束",
                    okText: '确认',
                    onOk: init
                })

            } else {
                // 判断位置是否可用
                if (!draft[outerBlockInfo[0]][outerBlockInfo[1]].data[innerBlockInfo[0]][innerBlockInfo[1]].data) {
                    // 赋值
                    draft[outerBlockInfo[0]][outerBlockInfo[1]].data[innerBlockInfo[0]][innerBlockInfo[1]].data = num;
                } 

                setCompareGroup(produce((draftCompare) => {
                    draftCompare.push(num)
                }))
                
            }
        }))
    }

    return(
        <div className={'container'}>
            <Block data={chessboard} changeData={getActiveBlockData}/>
            <div className='right'>
                <ToolBox fillData={fillBlock}/>
            </div>
        </div>
    )
}

export default ShuDu