import { Switch } from "antd";
import { useState } from "react";
import BlockList, { BlockListItem } from "./BlockList";
import Block from "./Block";

type SettingProps = {
  setting: {
    isDarkTheme?: boolean;
    mask?: boolean;
  };

  onSettingChange: (data: { field: string; value: any }) => void;
};

export default function Setting(props: SettingProps) {
  const { setting, onSettingChange } = props;

  const list: BlockListItem[] = [
    {
      label: "主题",
      end: (
        <Switch
          checkedChildren="暗"
          unCheckedChildren="亮"
          checked={setting?.isDarkTheme}
          onChange={(ck) =>
            onSettingChange({ field: "isDarkTheme", value: ck })
          }
        />
      ),
    },
    {
      label: "背景遮罩",
      end: (
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={setting?.mask}
          onChange={(ck) => onSettingChange({ field: "mask", value: ck })}
        />
      ),
    },
  ];

  return (
    <Block>
      <BlockList list={list} />
    </Block>
  );
}
