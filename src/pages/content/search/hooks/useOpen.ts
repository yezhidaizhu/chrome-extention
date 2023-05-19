import React from "react";

// 链接打开
export default function useOpen() {
  const wopen = (url = "", curTabOpen?: boolean) => {
    if (curTabOpen) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  };

  return { wopen };
}
