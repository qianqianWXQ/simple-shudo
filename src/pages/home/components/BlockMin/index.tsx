// @ts-ignore
import './index.less';
// import './index.module.scss'
export type BlockMinPropsType = {
    data: string | number,
    isActive?: boolean,
    onClick: () => void,
    hasBorder?: boolean,
    hasBackGround?: boolean,
    solidStyle?: boolean
}
const BlockMin = ({
    data,
    isActive = false,
    onClick,
    hasBorder = true,
    hasBackGround = false,
    solidStyle = false
}: BlockMinPropsType) => {
    
    return(
        <div 
            className={[
                "block_min", 
                isActive ? "active" : "",
                hasBorder ? "border" : "",
                hasBackGround ? "background" : "",
                solidStyle ? "solid_style" : ""
            ].join(" ")} 
            onClick={onClick}
        >
            {data}
        </div>
    )
}

export default BlockMin