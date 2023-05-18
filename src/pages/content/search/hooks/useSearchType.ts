import { useKeyPress, useThrottleFn } from "ahooks";
import { useEffect, useMemo, useState } from "react";

const tabList = [
  {
    label: "baidu",
    value: "baidu",
  },
  {
    label: "google",
    value: "google",
  },
  {
    label: "github",
    value: "github",
  },
  {
    label: "npm",
    value: "npm",
  },
];

export default function useSearchType() {
  // 搜索类型
  const [orginSearchTypes, setOrginSearchTypes] = useState<SearchType[]>([]);
  const searchTypes = useMemo<
    {
      label: string;
      value: string;
    }[]
  >(() => {
    return orginSearchTypes?.map((obj) => ({
      label: obj.label,
      value: obj.type,
    }));
  }, [orginSearchTypes]);

  const getSearchTypes = async () => {
    const data: any = await chrome.storage.local.get("searchTypes");
    if (data?.searchTypes) {
      const types = data?.searchTypes ?? [];
      setOrginSearchTypes(types);
    }
  };

  const getSearchPath = (keyword?: string) => {
    const curOrginSearchType = orginSearchTypes?.find((t) => t.type == curType);
    return curOrginSearchType?.searchPath?.replace("${keyword}", keyword);
  };

  // 默认搜索
  const defaultTypes = useMemo(() => {
    return searchTypes[0]?.value;
  }, [searchTypes]);
  const [curType, setCurType] = useState(defaultTypes); // 当前搜索类型

  useEffect(() => {
    if (searchTypes?.length) {
      setCurType(searchTypes[0]?.value);
    }
  }, [defaultTypes]);

  // 下一个搜索类型
  const nextSearchType = (rightArrow = true) => {
    const index = searchTypes?.findIndex((tab) => tab.value == curType);
    if (rightArrow) {
      // 正向
      setCurType(
        searchTypes[(index + 1) % searchTypes.length]?.value ?? defaultTypes
      );
    } else {
      // 反向
      setCurType(
        searchTypes[(index + searchTypes.length - 1) % searchTypes.length]
          ?.value ?? defaultTypes
      );
    }
  };

  // tab 切换
  const { run } = useThrottleFn(
    (rightArrow: boolean | undefined) => {
      nextSearchType(rightArrow);
    },
    { wait: 150 }
  );

  useEffect(() => {
    getSearchTypes();
  }, []);

  return { curType, setCurType, searchTypes, getSearchPath, runNextType: run };
}

interface SearchType {
  type?: string;
  label?: string;
  searchPath?: string;
  sugParams?: { [key: string]: string };
  sugParamsWdFeild?: string;
  sugUrl?: string;
}
