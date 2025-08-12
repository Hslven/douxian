import React from 'react';
import VideoThumb from "@/public/images/topbanner.jpg"; 
import Image from "next/image";
import GameHeader from './game-header';
export default function HeroSection({openRegisterModal}: any) {
  return (
    <section className="hero-section">
        {/* Hero content */}
        <div className="" style={{position:'relative'}}>
          {/* 顶部按钮区域 */}
          {/* <div className="absolute top-0 right-0 z-10 flex items-center p-4">
            <img src="/download-button.png" alt="游戏下载" className="mr-4" />
            <img src="/register-button.png" alt="账号注册" />
          </div> */}

          {/* 背景图片区域 */}
          <div className="flex justify-center items-center ">
            <GameHeader openRegisterModal={openRegisterModal} />
            <div className='' style={{position:'absolute',bottom:120,fontSize:80}}>原汁原味。经典回归</div>
            <div className='' style={{position:'absolute',bottom:70,fontSize:24}}>8月20日 归来公测</div>
                      <Image
                  className="inline-flex"
                  src={VideoThumb}
         
                  alt="Workflow 03"
                />
        </div>
      </div>
    </section>
  );
}