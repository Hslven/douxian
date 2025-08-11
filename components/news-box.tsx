import Image from "next/image";
import Illustration from "@/public/images/page-illustration.svg";
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import './news-box.css'

export default function NewsBox({title,header,content,footer}: any) {
  return (
    <div className="news-box-warp">
        <div className="news-box-title">{title}</div>
      <div
      className="news-box"
      >
        <div className="news-box-header">{header}</div>
        <div className="news-box-content">{content}</div>
        <div className="news-box-footer">{footer}</div>
      </div>
    </div>
  );
}
