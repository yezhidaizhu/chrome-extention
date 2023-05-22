import { Radio, Switch, message } from "antd";
import BlockList, { BlockListItem } from "./BlockList";
import Block from "./Block";
import { MenuOutlined } from "@ant-design/icons";
import { Dnd } from "./dnd";

type SettingProps = {
  setting: {
    theme?: string;
    mask?: boolean;
    searchTypes?: any[];
  };

  onSettingChange: (data: { field: string; value: any }) => void;
};

export default function Setting(props: SettingProps) {
  const { setting, onSettingChange } = props;

  // 设置 searchType disabled
  const setSearchType = (newItem) => {
    const oldSearchTypes = setting.searchTypes ?? [];
    const newSearchTypes = oldSearchTypes?.map((item) => {
      return item?.value === newItem?.id ? newItem : item;
    });
    // 不允许全部都为 disabled
    const powerSearchType = newSearchTypes?.filter((item) => !item.disabled);
    if (!powerSearchType?.length) {
      const msg = "至少拥有一个类型";
      message.warning({ key: msg, content: msg });
    } else {
      onSettingChange({ field: "searchTypes", value: newSearchTypes });
    }
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
    {
      label: "搜索类型",
      desc: (
        <div className="sortSearchTypeItemBox">
          <Dnd
            items={setting.searchTypes}
            setItems={(items) => {
              console.log(items);

              onSettingChange({ field: "searchTypes", value: items });
            }}
            item={(item) => (
              <SearchTypeSortItem
                data={item}
                onChange={(disabled: boolean) => {
                  setSearchType({ ...item, disabled: disabled });
                }}
              />
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <Block>
      <BlockList list={list} />
    </Block>
  );
}

function SearchTypeSortItem(props: {
  data: any;
  onChange: (ck: boolean) => void;
}) {
  return (
    <div className="sortSearchTypeItem">
      <div>
        <MenuOutlined style={{ fontSize: "12px", marginRight: "6px" }} />
        {props.data?.label}
      </div>
      <div>
        <Switch
          checked={!props?.data?.disabled}
          checkedChildren="开"
          unCheckedChildren="关"
          onChange={(ck) => {
            props.onChange(!ck);
          }}
        />
      </div>
    </div>
  );
}
