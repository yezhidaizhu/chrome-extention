import { Segmented } from "antd";
import useSearchType from "./hooks/useSearchType";
import { useEffect, useRef, useState } from "react";

import SugList from "./components/SugList";
import { useKeyPress } from "ahooks";
import useSugList from "./hooks/useSugList";
import useOpen from "./hooks/useOpen";
import useSearchHistory from "./hooks/useSearchHistory";
import Recent from "./components/Recent";
import { SettingFilled } from "@ant-design/icons";
import Setting from "./components/Setting";
import useSetting from "./hooks/useSetting";

export default function Search(props: { closeSearch: () => void }) {
  const { closeSearch } = props;

  const searchInputRef = useRef<HTMLInputElement>();

  const { setting, onSettingChange, openSetting, toggleOpenSetting } =
    useSetting();

  const { curType, searchTypes, setCurType, getSearchPath, runNextType } =
    useSearchType();

  const { suglist, onSearchValueChange, clearSugList } = useSugList({
    curSugType: curType,
  });

  const { pushHistory, rmHistory } = useSearchHistory();

  // 打开
  const { wopen } = useOpen();

  // 搜索
  const [searchValue, setsearchValue] = useState("");

  // 上下键选中的值
  const [activeId, setActiveId] = useState<string>();

  // 前往搜索
  const handleOpen = (path: string, curTabOpen?: boolean) => {
    closeSearch?.();
    wopen(path, curTabOpen);
  };

  // 根据当前的搜索类型，前往搜索
  const handleOpenWithSearchValue = (value: string, curTabOpen?: boolean) => {
    if (!value) return;
    handleOpen(getSearchPath(value), curTabOpen);
  };

  // 上下键
  useKeyPress(["uparrow", "downarrow"], (e) => {
    const listLen = suglist?.length;
    if (!listLen) return;

    const searchItemIndex = suglist?.findIndex((item) => item.id === activeId);
    const searchItem = suglist[searchItemIndex];

    if (e.key === "ArrowDown") {
      if (searchItem) {
        setActiveId(suglist[(searchItemIndex + 1) % listLen]?.id);
      } else {
        setActiveId(suglist[0]?.id);
      }
    } else if (e.key === "ArrowUp") {
      if (searchItem) {
        setActiveId(suglist[(searchItemIndex + listLen - 1) % listLen]?.id);
      } else {
        setActiveId(suglist[listLen - 1]?.id);
      }
    }
  });

  const enterConfirm = (curTabOpen?: boolean) => {
    // 按上下箭头选中的item，
    // 因为里面带有 path，可能不是 search 路径，例如baidu与npm不同，npm 返回的 sugList 中的path，直接进入该项目
    const sugItem = suglist?.find((item) => item.id === activeId);
    if (sugItem && sugItem?.id === activeId) {
      handleOpen(sugItem?.path, curTabOpen);
    } else {
      if (searchValue?.trim()) {
        pushHistory(curType, searchValue);
        handleOpenWithSearchValue(searchValue, curTabOpen);
      }
    }
  };

  // 回车确认
  useKeyPress(["enter"], () => enterConfirm(), { exactMatch: true });

  // shift + 回车确认，或者点击在当前标签打开
  useKeyPress(["shift.enter"], () => enterConfirm(true));

  // tab 下一个
  useKeyPress(
    ["tab"],
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      runNextType(true);
    },
    { exactMatch: true }
  );

  // shift + tab 上一个
  useKeyPress(
    ["shift.tab"],
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      runNextType(false);
    },
    { exactMatch: true }
  );

  // 当上下键选择改变
  useEffect(() => {
    const searchItem = suglist?.find((item) => item.id === activeId);

    if (searchItem) {
      setsearchValue(searchItem?.label);
    }
  }, [activeId]);

  // 当搜索值改变
  useEffect(() => {
    if (!searchValue) {
      setActiveId(undefined);
    }
  }, [searchValue]);

  // 当搜索是否显示改变时
  useEffect(() => {
    setTimeout(() => {
      searchInputRef?.current?.focus?.();
    });
  }, []);

  // 当搜索类型改变
  useEffect(() => {
    // 切换后直接触发该类型搜索
    onSearchValueChange(searchValue);
    clearSugList();
  }, [curType]);

  return (
    <div className={`searchBox ${setting?.isDarkTheme ? "dark" : ""}`}>
      <div className="searchBoxContent">
        <div className="top">
          {/* 切换搜索 */}
          <Segmented
            value={curType}
            options={searchTypes}
            onChange={(v: any) => {
              setCurType(v);
            }}
          />

          {/* 设置按钮 */}
          <div
            className="settingIcon"
            onClick={() => {
              toggleOpenSetting();
            }}
          >
            <SettingFilled />
          </div>
        </div>

        {/* 输入 */}
        <input
          ref={searchInputRef}
          className={`searchInput`}
          value={searchValue}
          placeholder={curType}
          onChange={(e: any) => {
            const value = e?.target?.value;
            setsearchValue(value);
            onSearchValueChange(value);
          }}
        />

        {/* 最近 */}
        <Recent
          show={!suglist?.length}
          curSearchType={curType}
          onClick={(item) => {
            handleOpenWithSearchValue(item?.label);
          }}
          onSel={setsearchValue}
        />

        {/* 建议 */}
        <SugList
          list={suglist}
          activeId={activeId}
          onClick={(item) => {
            handleOpen(item?.path);
          }}
        />

        {/* 设置 */}
        {openSetting && (
          <Setting setting={setting} onSettingChange={onSettingChange} />
        )}
      </div>
    </div>
  );
}
