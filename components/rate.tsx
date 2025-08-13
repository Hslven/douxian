import Image from "next/image";
import "./rate.css";
import rate_full from "../public/images/rate_full.png";
import rate from "../public/images/rate.png";
export default function Rate({ value }: { value: number }) {
  return (
    <div className="flex game-rate">
      {Array.from({ length: 5 }).map((_, index) => (
        <Image
          key={index}
          className="game-rate-item"
          src={index + 1 > value ? rate : rate_full}
          alt=""
        />
      ))}
    </div>
  );
}
