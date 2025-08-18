import "./news-box.css";

export default function NewsBox({ title, header, content, footer }: any) {
  return (
    <div className="news-box-warp">
      <div className="news-box-title">{title}</div>
      <div className="news-box">
        <div className="news-box-header">{header}</div>
        <div className="news-box-content">{content}</div>
        <div className="news-box-footer">{footer}</div>
      </div>
    </div>
  );
}
