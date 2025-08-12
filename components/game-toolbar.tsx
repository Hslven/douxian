import Image from "next/image";
import "./game-toolbar.css";
import Modal from "./modal";
import nvwashi from '../public/images/nvwashi.png'
import { useState } from "react";

export default function GameToolbar({ openRegisterModal }: any) {
  const [giftDetail, setGiftDetail] = useState({
    code: '5512315asd',
    list: [{id:1, name: '女娲石' ,number: 1},{id:2, name: '女娲石' ,number: 1},{id:3, name: '女娲石' ,number: 1},{id:4, name: '女娲石' ,number: 1},{id:5, name: '女娲石' ,number: 1}],

  });
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  return (
    <div className="game-toolbar normal">
      <div className="game-toolbar-down">
        <img src="/images/down_new.png" />
      </div>
      <div className="game-toolbar-box">
        <div className="game-toolbar-btn" onClick={openRegisterModal}>
          账号注册
        </div>
        <div
          className="game-toolbar-btn"
          onClick={() => setGiftModalOpen(true)}
        >
          特权礼包
        </div>
        <div className="game-toolbar-btn">新手入门</div>
        <div className="game-toolbar-btn">客服服务</div>
      </div>
      <Modal
        visible={giftModalOpen}
        title="示例弹窗"
        onClose={() => setGiftModalOpen(false)}
        width="600px"
      >
        <div className="gift-modal-content">
          <div  className="gift-modal-title">官方独家礼包</div>
          <div className="gift-modal-detail">
            <div  className="gift-modal-code">礼包码：{giftDetail.code}</div>
            <div className="gift-list">

            {giftDetail.list.map((item) => (
              <div key={item.id}  className="gift-item">
                <Image src={nvwashi} alt="gift-item-img" />
                <div  className="gift-item-name">{item.name} * {item.number}</div>
              </div>
            ))}
            </div>
          </div>
          <div>兑换途径:游戏内主界面右上角“礼包奖励”官网礼包”进行兑换</div>
          <div>有效期:2017年12月28日-2018年12月31日</div>
          <div>
            礼包说明:本礼包仅限安卓官服玩家激活使用，每个账号仅限激活一次该礼包
          </div>
          <div>
            因苹果公司政策苹果用户无法使用礼包码，登录即享九大公测福利。
          </div>
          <img src="" />
          <div>关注QQ群更多惊喜礼包</div>
          <img src="" />
        </div>
      </Modal>
    </div>
  );
}
