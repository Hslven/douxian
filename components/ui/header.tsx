"use client";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import request, { getImgUrl } from "@/utils/request";
import home from "@/public/images/导航栏-未激活-官网首页.png";
import home_active from "@/public/images/导航栏-已激活-官网首页.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./header.css";

const options = [
  {
    name: "官网首页",
    url: home,
    activeUrl: home_active,
  },
  {
    name: "新闻资讯",
    url: home,
    activeUrl: home_active,
  },
  {
    name: "门派介绍",
    url: home,
    activeUrl: home_active,
  },
  {
    name: "游戏特色",
    url: home,
    activeUrl: home_active,
  },
  {
    name: "联系我们",
    url: home,
    activeUrl: home_active,
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
    request.get("/douxian/web/qr-code").then((res) => setContactList(res));
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contactVisible]);

  return (
    <div className="nav-bar">
      {(!currentPage || showLogo) && (
        <div className="game-header">
          <div className="game-header-logo" onClick={() => router.push("/")}>
            <img className="btn-bg" src={getImgUrl(buttonImgs.homeLogoImg)} />
          </div>
        </div>
      )}
      {options.map((item, index) => (
        <a
          className={classNames("nav-bar-btn", {
            // "nav-bar-btn-active": currentPage === index,
          })}
          key={item.name}
          onClick={() => {
            if (index + 1 !== options.length) {
              scrollToPage(index);
            } else {
              setContactVisible(!contactVisible);
            }
          }}
        >
          <Image
            src={currentPage === index ? item.activeUrl : item.url}
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
                <img src={getImgUrl(item.qrCodeImage)} />
              </div>
              <div>{item.qrCodeName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
