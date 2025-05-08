// @ts-ignore
import { useContext } from 'react';
import { GameOverContext } from '../..';
import './index.less';
import { Modal } from 'antd';
// import './index.module.scss'
export type BlockMinPropsType = {
    data: string | number,
    isRepeat: boolean,
    onClick: () => void,
    isActive?: boolean,
    hasBorder?: boolean,
    hasBackGround?: boolean,
    solidStyle?: boolean,
}
const BlockMin = ({
    data,
    isActive = false,
    onClick,
    hasBorder = true,
    hasBackGround = false,
    solidStyle = false,
    isRepeat=false
}: BlockMinPropsType) => {
    const isGameOver = useContext(GameOverContext);
    const handleClick = () => {
        if(!isGameOver) {
            onClick()
        } else {
            Modal.error({
                title: '游戏结束',
                content: '游戏已结束，不可输入数据，请点击右下角按钮重新开始 ~',
            });
        }
    }
    return(
        <div 
            className={[
                "block_min", 
                isActive ? "active" : "",
                hasBorder ? "border" : "",
                hasBackGround ? "background" : "",
                solidStyle ? "solid_style" : "",
                isRepeat ?"repeat" : ''
            ].join(" ")} 
            onClick={handleClick}
        >
            {data}
        </div>
    )
}

export default BlockMin