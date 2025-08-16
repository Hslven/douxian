import Image from "next/image";
import "./game-toolbar.css";
import Modal from "./modal";
import gift from '../public/images/gift.png'
import gift_line from '../public/images/gift_line.png'
import group_code from '../public/images/group_code.png'
import { useState } from "react";

export default function GameToolbar({ className, openRegisterModal }: any) {
  const [giftDetail, setGiftDetail] = useState({
    code: '5512315asd',
    list: [{id:1, name: '女娲石' ,number: 1},{id:2, name: '女娲石' ,number: 1},{id:3, name: '女娲石' ,number: 1},{id:4, name: '女娲石' ,number: 1},{id:5, name: '女娲石' ,number: 1}],

  });
  const [giftModalOpen, setGiftModalOpen] = useState(false);

  return (
    <div className={`game-toolbar ${className}`}>
      <div className="game-toolbar-down">
        游戏下载
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
        title="官方独家礼包"
        onClose={() => setGiftModalOpen(false)}
      >
        <div className="gift-modal-content">
            <div  className="gift-modal-code">礼包码：{giftDetail.code}</div>

          <div className="gift-modal-detail">
            <div className="gift-list">

            {giftDetail.list.map((item) => (
              <div key={item.id}  className="gift-item">
                <Image src={gift} alt="" />
                <div>{item.name}*{item.number}</div>
              </div>
            ))}
            </div>
          </div>
          <div className="gift-info">兑换途径:游戏内主界面右上角“礼包奖励”官网礼包”进行兑换</div>
          <div className="gift-info">有效期:2017年12月28日-2018年12月31日</div>
          <div className="gift-info">
            礼包说明:本礼包仅限安卓官服玩家激活使用，每个账号仅限激活一次该礼包
          </div>
          <div className="gift-info">
            因苹果公司政策苹果用户无法使用礼包码，登录即享九大公测福利。
          </div>
          <Image src={gift_line} alt="" />
          <div className="gift-footer">

          <div className="">关注QQ群更多惊喜礼包</div>
          <Image className="inline-block" src={group_code} alt="" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
