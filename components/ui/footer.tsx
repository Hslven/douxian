"use client";
import "./Footer.css"; // 引入 CSS 文件

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-icon1"></div>
      <div className="footer-icon2"></div>
      <div className="footer-line"></div>
      <div className="footer-text">
        <div>深圳市吉昭梦文化网络科技有限公司</div>
        <div>
          增值电信业务经营许可证：粤B2-20251369{" "}
          <span
            className="footer-text-line"
            onClick={() => window.open("https://beian.miit.gov.cn/")}
          >
            粤ICP备2025417760号
          </span>
        </div>
        <div>ISBN:978-7-89429-183-7 审批文号：科技与数字[2013]18号</div>
        <div>
          健康游戏忠告:抵制不良游戏,拒绝盗版游戏。注意自我保护,谨防受骗上当。适度游戏益脑,沉迷游戏伤身。合理安排时间,享受健康生活。
        </div>
        <div>本游戏适合18岁及以上玩家进入</div>
      </div>
    </footer>
  );
}
