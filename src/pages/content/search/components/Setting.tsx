import { Radio, Switch } from "antd";
import { useState } from "react";
import BlockList, { BlockListItem } from "./BlockList";
import Block from "./Block";

type SettingProps = {
  setting: {
    theme?: string;
    mask?: boolean;
  };

  onSettingChange: (data: { field: string; value: any }) => void;
};

export default function Setting(props: SettingProps) {
  const { setting, onSettingChange } = props;

  const onChange = (e) => {
    console.log(e);
  };

  const list: BlockListItem[] = [
    {
      label: "主题",
      end: (
        <Radio.Group
          value={setting?.theme}
          size="small"
          buttonStyle="solid"
          onChange={(event) => {
            const value = event?.target?.value;
            onSettingChange({ field: "theme", value: value });
          }}
        >
          <Radio.Button value="light">月白</Radio.Button>
          <Radio.Button value="dark">暗黑</Radio.Button>
        </Radio.Group>
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
