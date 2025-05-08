// @ts-ignore
import { useState, createContext } from 'react';
import Block from './components/Block';
import ToolBox from './components/ToolBox';
import './index.less';
import {produce} from "immer";
import { dataType } from './interface';
import { Button, Modal } from "antd";
/**
 * 棋盘初始数据
 * 使用 { data: '', isActive: false } 填充 9*9 个格子
 */
const blockArray = new Array(3).fill(new Array(3).fill({
    data: new Array(3).fill(new Array(3).fill({ data: '', isActive: false, isRepeat:false })),
    isActive: false
}))

export const GameOverContext = createContext(false)

const ShuDu = () => {
    // 棋盘
    const[chessboard, setChessBoard] = useState(blockArray);

    // 记录在当前粉色背景的区域内的数字
    // 粉色背景中的数字区域内，数字不能重复
    const [compareGroup, setCompareGroup] = useState<dataType[]>([]);

    /**
     * 将整个棋盘 9*9 布局，其中 3*3 为一组，共 9组
     * outerBlockInfo - 当前 组，在 -- 整个棋盘 -- 的位置
     * innerBlockInfo - 当前格子，在 -- 当前组中 -- 的位置
     */
    const [outerBlockInfo, setOuterBlockInfo] = useState<number[]>([]);
    const [innerBlockInfo, setInnerBlockInfo] = useState<number[]>([]);

    // 游戏是否结束
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    // 初始化
    const init = () => {
        // 恢复数据的初始状态
        setChessBoard(blockArray)
        setCompareGroup([])
        setOuterBlockInfo([])
        setInnerBlockInfo([])
        setIsGameOver(false)
    }

    // 更新 UI 
    const getActiveBlockData = (
        outerBlockInfo: number[], // 二维数组
    ) => {
        return function (innerBlockInfo: number[]) { 
            console.log({outerBlockInfo, innerBlockInfo})
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
                        // console.log({currentDataGroup: currentDataGroup[i][j].data})
                        if (currentDataGroup[i][j].data) {
                            tempData.push({
                                data:currentDataGroup[i][j].data,
                                innerPosition: [i, j],
                                outerPosition: [outerX,outerY]
                            });
                        }
                    }
                }

                // 当前方格内容 变色
                draft[outerX][outerY].data[innerX][innerY].isActive = true;

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
                    while((newOuterX >= 0 && newOuterX <=2) && (newOuterY >= 0 && newOuterY <=2)) {
                        // 符合条件的行/列的所有值
                        if (dx !== 0) { // 横向走
                            for (let x = 0; x <= 2; x ++) {
                                draft[newOuterX][newOuterY].data[x][newInnerY].isActive = true;
                                const currentData = draft[newOuterX][newOuterY].data[x][newInnerY].data;
                                if (currentData) {
                                    tempData.push({
                                        data: currentData,
                                        innerPosition: [x, newInnerY],
                                        outerPosition: [newOuterX, newOuterY]
                                    })
                                }
                                
                            }
                        }

                        if (dy !== 0) { // 纵向走
                            for (let y = 0; y <= 2; y ++) {
                                draft[newOuterX][newOuterY].data[newInnerX][y].isActive = true;
                                const currentData = draft[newOuterX][newOuterY].data[newInnerX][y].data;
                                if (currentData) {
                                    // tempData.push(currentData)
                                    tempData.push({
                                        data: currentData,
                                        innerPosition: [newInnerX, y],
                                        outerPosition: [newOuterX, newOuterY]
                                    })
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

    // 判断数据是否符合数独游戏的需要
    const checkData = (num:number) => {
        // 判断数据内容是否 符合数独游戏要求
        for (let i = 0; i < compareGroup.length; i ++) {
            if (num === Number(compareGroup[i].data)) {
                return {
                    flag: false,
                    innerPosition: compareGroup[i].innerPosition,
                    outerPosition: compareGroup[i].outerPosition
                }
            }
        }
        return {
            flag: true
        }
    }
    // 填写数字
    const fillBlock = (num: number) => {
        // 改变棋盘内容
        setChessBoard(produce((draft) => {
            if (outerBlockInfo.length === 0 && innerBlockInfo.length === 0) {
                // 判断是否已经选中棋盘位置，若没有，则先选中
                Modal.error({
                    title: "请先选择棋盘上要填数字的位置，再填数字！",
                    okText: '确认'
                })
            } else {
                console.log({num})
                // 获取当前点击格子内的数字
                const currentData = draft[outerBlockInfo[0]][outerBlockInfo[1]].data[innerBlockInfo[0]][innerBlockInfo[1]].data;
                if (currentData) {// 当前位置有数字，则弹出提示弹窗
                    Modal.error({
                        title: "当前位置已经有数据啦，不要重复填写！",
                        okText: '确认'
                    })
                } else { // 当前位置没有数字
                    const { flag, innerPosition=[], outerPosition=[] } = checkData(num) || {};
                    if (!flag) { // 游戏结束
                        // 添加标记 ---- 当前值与之前填入值相同时，使用 条纹背景 标记 之前填入的值的位置
                        draft[outerPosition[0]][outerPosition[1]].data[innerPosition[0]][innerPosition[1]].isRepeat = true;
                        Modal.error({
                            title: "游戏结束",
                            okText: '确认'
                            // onOk: init
                        })
                        // 改为消息提示
                        setIsGameOver(true)
                    }
                    // 填数---将数据填写到棋盘中
                    draft[outerBlockInfo[0]][outerBlockInfo[1]].data[innerBlockInfo[0]][innerBlockInfo[1]].data = num;
                    setCompareGroup(produce((draftCompare) => {
                       draftCompare.push({
                            data: num,
                            innerPosition: innerBlockInfo,
                            outerPosition: outerBlockInfo
                        })
                    }))
                }
            }
        }))
    }

    // 游戏重新开始 ？
    const restart = () => {
        if (isGameOver) {
            init();
        } else {
            // 先弹出提示框，询问是否要结束游戏，确认之后再进行操作
            Modal.error({
                title: "结束游戏之后，当前游戏数据会丢失，确认要结束游戏吗？",
                okText: '确认',
                onOk: init
            })
        }
    }
    return(
        <GameOverContext.Provider value={isGameOver}>
            <div className={'title_container'}>
                <div className={'title'}>
                    数独小游戏
                    {
                        isGameOver
                        && <span className={'game_over'}>游戏结束！,请点击右侧按钮重新开始</span>
                    }
                </div>
                
            </div>
            <div className={'container'}>
                <Block data={chessboard} changeData={getActiveBlockData} />
                <div className='right'>
                    <ToolBox fillData={fillBlock} />
                    <div className={'btn_box'}>
                        <Button size='large' type='primary' onClick={restart}>重新开始</Button>
                    </div>
                    
                </div>
            </div>
        </GameOverContext.Provider>
        
    )
}

export default ShuDu