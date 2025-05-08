// @ts-ignore
import BlockMin from '../BlockMin';
import './index.less';
// import './index.module.scss'
type ToolBoxPropsType = {
  fillData: (num: number) => void
}
const ToolBox = ({
  fillData
}:ToolBoxPropsType) => {
    const blockArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const onClick = (num: number) => {
      fillData(num)
    }

    return(
        <div className="toolBox_container">
          toolbox
          <div className="number_block">
            {
              blockArray
              && blockArray.length > 0
              && blockArray.map((item, index) => {
                return (
                  <BlockMin 
                    key={index} 
                    data={item} 
                    onClick={() => onClick(item)}
                    hasBorder={false}
                    hasBackGround={true}
                    solidStyle={true}
                  />
                )
              })
            }
          </div>
        </div>
    )
}

export default ToolBox