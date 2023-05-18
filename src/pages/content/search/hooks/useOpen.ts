import React from "react";

// 链接打开
export default function useOpen() {
  const wopen = (url = "") => window.open(url, "_blank");

  return { wopen };
}
