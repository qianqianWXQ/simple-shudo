// @ts-ignore
import BlockMin, { BlockMinPropsType } from '../BlockMin';
import './index.less';
// import './index.module.scss'
export type BlockInnerPropsType = {
    data: Array<BlockMinPropsType>[],
    isActive: boolean,
    changeChessData: (info: number[]) => void 
}
const BlockInner = ({
    data,
    isActive,
    changeChessData
}: BlockInnerPropsType) => {
    // console.log({isActive})
    // console.log({data})
    return(
        <div className={["block_inner_container", isActive ? "active" : ""].join(" ")}>
            {
                data && data.length > 0 && data.map((item, index) => {
                    if (Array.isArray(item)) {
                        return item.map((innerItem, innerIndex) => {
                            const innerBlockInfo = [index, innerIndex]
                            return (
                                <BlockMin 
                                    key={index + innerIndex + ""} 
                                    {...innerItem} 
                                    onClick={() => changeChessData(innerBlockInfo)} 
                                />
                            )
                        })
                    } else {
                        return ''
                    }
                })
            }
        </div>
    )
}

export default BlockInner