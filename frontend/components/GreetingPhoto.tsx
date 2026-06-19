import { asset } from "@/lib/asset";

/** 인사말 아래 전체 폭 사진 (snd.jpg) */
export function GreetingPhoto() {
  return (
    <div className="reveal">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/images/snd.jpg")}
        alt="신랑 신부 사진"
        className="block w-full"
      />
    </div>
  );
}
