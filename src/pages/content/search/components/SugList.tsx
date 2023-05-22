import BlockList from "./BlockList";
import { SugResultListItem } from "../hooks/useSugList";
import Block from "./Block";
import { GithubOutlined, HomeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

export default function SugList(props: {
  list: SugResultListItem[];
  activeId?: string;
  title?: any;
  onClick?: (item: SugResultListItem) => void;
  onDelete?: (e: any, item: SugResultListItem) => void;
  showDeleteBtn?: boolean;
}) {
  const { list } = props;

  if (!props.list?.length) return <></>;

  const _list = list?.map((item: any) => {
    const { end = "", links } = item;
    return {
      ...item,
      end: (
        <div className="sugListEnd">
          {/* npm 内可能带有链接 */}
          {links?.repository && (
            <Tooltip title={links?.repository}>
              <div
                className="linkItem"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClick?.({ ...item, path: links?.repository });
                }}
              >
                <GithubOutlined size={12} />
              </div>
            </Tooltip>
          )}
          {links?.homepage && (
            <Tooltip title={links?.homepage}>
              <div
                className="linkItem"
                onClick={(e) => {
                  e.stopPropagation();
                  props.onClick?.({ ...item, path: links?.homepage });
                }}
              >
                <HomeOutlined size={12} />
              </div>
            </Tooltip>
          )}
          <div>{end}</div>
        </div>
      ),
    };
  });

  return (
    <Block>
      <BlockList {...props} list={_list} />
    </Block>
  );
}

// {
//   "npm": "https://www.npmjs.com/package/t-shape",
//   "homepage": "https://github.com/wongsean/t-shape#readme",
//   "repository": "https://github.com/wongsean/t-shape",
//   "bugs": "https://github.com/wongsean/t-shape/issues"
// }
