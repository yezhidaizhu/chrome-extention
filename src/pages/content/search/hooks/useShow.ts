import { useKeyPress } from "ahooks";
import { useState } from "react";

export default function useShow() {
  const [show, setShow] = useState(false);
  const [preClickTimeline, setPreClickTimeline] = useState(0);

  // 双击 jj 唤醒
  useKeyPress(["j"], () => {
    if (show) return;
    const curTimeline = new Date().getTime();
    if (preClickTimeline && curTimeline < preClickTimeline + 1000 * 0.2) {
      setShow(true);
    } else {
      setPreClickTimeline(curTimeline);
    }
  });

  // esc 关闭
  useKeyPress(["esc"], () => {
    if (!show) return;
    show && setShow(false);
  });

  // 关闭
  const closeSearch = () => {
    setShow(false);
  };

  return { show, closeSearch };
}
