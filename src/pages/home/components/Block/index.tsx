// @ts-ignore
import { useState } from 'react';
// @ts-ignore
import type { BlockInnerPropsType } from '../BlockInner';
import './index.less';
// @ts-ignore
import BlockInner from '../BlockInner';
// import './index.module.scss'
type BlockPropsType = {
    data: Array<BlockInnerPropsType>[],
    changeData: (info1: number[]) => any
}

const Block = ({
    data,
    changeData
}: BlockPropsType) => {
    return(
        <div className="block_container">
            {
                data.map((item, index) => {
                    // console.log({index})
                    if (Array.isArray(item)) {
                        return item.map((innerItem, innerIndex) => {
                            // console.log({innerItem})
                            return (
                                <BlockInner 
                                    key={index + innerIndex + ""} 
                                    {...innerItem} 
                                    blockInfo={[index, innerIndex]}
                                    changeChessData={changeData([index, innerIndex])}
                                />
                            )
                        })
                    } else {
                        return '';
                    }
                })
            }
        </div>
    )
}

export default Block