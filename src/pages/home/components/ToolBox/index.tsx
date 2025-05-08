// @ts-ignore
import { useContext } from 'react';
import { GameOverContext } from '../..';
import BlockMin from '../BlockMin';
import './index.less';
import { Modal } from 'antd';
// import './index.module.scss'
type ToolBoxPropsType = {
  fillData: (num: number) => void
}
const ToolBox = ({
  fillData
}:ToolBoxPropsType) => {
    const isGameOver = useContext(GameOverContext);
    // const [messageApi] = message.useMessage();
    const handleClick = (item: number) => {
        if(!isGameOver) {
          fillData(item)
        } else {
          Modal.error({
            title: '游戏结束',
            content: '游戏已结束，不可输入数据，请点击右下角按钮重新开始 ~',
          });
        }
    }

    const blockArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
                    onClick={() => handleClick(item)}
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