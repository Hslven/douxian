"use client";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import request, { getImgUrl } from "@/utils/request";
import nav_home from "@/public/images/nav_home.png";
import nav_home_active from "@/public/images/nav_home_active.png";
import nav_news from "@/public/images/nav_news.png";
import nav_news_active from "@/public/images/nav_news_active.png";
import nav_sects from "@/public/images/nav_sects.png";
import nav_sects_active from "@/public/images/nav_sects_active.png";
import nav_gameplay from "@/public/images/nav_gameplay.png";
import nav_gameplay_active from "@/public/images/nav_gameplay_active.png";
import nav_contact from "@/public/images/nav_contact.png";
import nav_contact_active from "@/public/images/nav_contact_active.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./header.css";

const options = [
  {
    name: "官网首页",
    url: nav_home,
    activeUrl: nav_home_active,
  },
  {
    name: "新闻资讯",
    url: nav_news,
    activeUrl: nav_news_active,
  },
  {
    name: "门派介绍",
    url: nav_sects,
    activeUrl: nav_sects_active,
  },
  {
    name: "游戏特色",
    url: nav_gameplay,
    activeUrl: nav_gameplay_active,
  },
  {
    name: "联系我们",
    url: nav_contact,
    activeUrl: nav_contact_active,
  },
];
export default function Header({
  showLogo,
  currentPage,
  scrollToPage,
  buttonImgs,
}: {
  showLogo?: boolean;
  currentPage: number;
  scrollToPage: Function;
  buttonImgs: any;
}) {
  const [contactList, setContactList] = useState([]);
  const [contactVisible, setContactVisible] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    request
      .get("/douxian/web/qr-code")
      .then((res) => setContactList(res || []));
  }, []);

  // 点击弹窗外部关闭
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        contactVisible
      ) {
        setContactVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contactVisible]);
  return (
    <div className="nav-bar">
      {(!currentPage || showLogo) && (
        <div className="game-header-logo" onClick={() => router.push("/")}>
          <img className="btn-bg" src={getImgUrl(buttonImgs.homeLogoImg)} />
        </div>
      )}
      {options.map((item, index) => (
        <a
          className={classNames("nav-bar-btn", {
            "nav-bar-btn-active":index + 1 === options.length ? contactVisible : currentPage === index,
          })}
          key={item.name}
          onClick={(e) => {
            if (index + 1 !== options.length) {
              scrollToPage(index);
            } else {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setContactVisible((prev) => !prev);
            }
          }}
        >
          <Image
            src={(index + 1 === options.length ? contactVisible : currentPage === index )? item.activeUrl : item.url}
            alt=""
          />
          {/* {item.name} */}
        </a>
      ))}
      {contactVisible && (
        <div className="nav-bar-contact" ref={modalRef}>
          {contactList.map((item) => (
            <div key={item.qrCodeId} className="nav-bar-contact-box">
              <div className="nav-bar-contact-code">
                <img
                  className="nav-bar-contact-code-img"
                  src={getImgUrl(item.qrCodeImage)}
                />
                {/* <Image className="nav-bar-contact-code-border" src={nav_bar_code_border} alt="" /> */}
              </div>
              <div className="nav-bar-contact-codename">{item.qrCodeName}</div>
            </div>
          ))}
          {/* <Image className="nav-bar-contact-code-bg" src={contact_bg} alt="" /> */}
        </div>
      )}
      {/* <Image className="nav-bar-bg" src={nav_bg} alt="" /> */}
    </div>
  );
}
