"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FooterIllustration from "@/public/images/footer-illustration.svg";
import "./Footer.css"; // 引入 CSS 文件

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-icon-box">
        <img src='/images/icon1.png' className="footer-icon-jr"  />
        <img src='/images/icon2.png' className="footer-icon-yy" />
      </div>
      <div className="footer-content">
        {/* <div className="logo-container">
          <Logo />
        </div> */}

        <div className="footer-text">
          <div>本游戏适合18岁及以上的实名玩家进入。</div>
          <div>增值电信业务经营许可证：粤B2-20110748</div>
          <div>粤ICP备11051034号 网络文化经营许可证：粤网文[2017]7568-1825号</div>
          <div>粤公网安备 44040202000835号 文网游进字[2016] C-RPG 0521 号 家长监护系统</div>
          <div>健康游戏公告：抵制不良游戏，拒绝盗版游戏，注意自我保护，谨防上当受骗，适度游戏益脑，沉迷游戏伤身，合理安排时间，享受健康生活。</div>
          <div>Copyright © 2011-2024 ixinyou. All rights reserved. 珠海心游科技股份有限公司 版权所有</div>
        </div>

        {/* <div className="footer-links">
          <Link className="footer-link" href="/terms">服务条款</Link>
          <Link className="footer-link" href="/privacy">隐私政策</Link>
          <Link className="footer-link" href="/contact">联系我们</Link>
        </div> */}

        {/* <div className="footer-copyright">
          <div>Copyright © 2011-2024 ixinyou. All rights reserved. 珠海心游科技股份有限公司 版权所有</div>
        </div> */}
      </div>
    </footer>
  );
}