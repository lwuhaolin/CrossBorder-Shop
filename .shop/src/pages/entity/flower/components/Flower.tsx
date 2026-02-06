import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import { ActionType, ProList, ProListProps } from "@ant-design/pro-components";
import {
  Badge,
  Button,
  Divider,
  Image,
  message,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FullscreenExitOutlined,
  PlusOutlined,
  StarTwoTone,
} from "@ant-design/icons";
import { useResponsive } from "ahooks";
import { BadgeProps } from "antd/es/badge";
// @ts-ignore
import { useNavigate } from "react-router";
import { PresetColors } from "antd/es/theme/interface/presetColors";
import { DateTime } from "luxon";
import request, { instance } from "@/utils/request";
import Creator from "@/pages/entity/flower/components/Creator";
import XinInventory from "@/pages/entity/flower/components/XinInventory";
import XinSold from "@/pages/entity/flower/components/XinSold";

const Flower: React.FC<
  ProListProps & {
    cutter: readonly [
      boolean,
      {
        readonly enterFullscreen: () => void;
        readonly exitFullscreen: () => void;
        readonly toggleFullscreen: () => void;
        readonly isEnabled: true;
      }
    ];
    bag: [
      Record<string, any>[],
      Dispatch<SetStateAction<Record<string, any>[]>>
    ];
    holder: MutableRefObject<ActionType | undefined>;
  }
> = (props) => {
  const navigate = useNavigate();
  const responsive = useResponsive();

  const wrap = (props: BadgeProps, description: React.ReactNode) => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Badge color="lime" text="库存" {...props} />
      {description}
    </div>
  );

  return (
    <ProList<any>
      actionRef={props.holder}
      ghost={!props.cutter[0]}
      style={
        props.cutter[0]
          ? {
              height: "100%",
            }
          : undefined
      }
      cardProps={
        props.cutter[0] && {
          title: "鲜花市场",
          extra: [
            <Button
              key="change"
              icon={<FullscreenExitOutlined />}
              onClick={props.cutter[1].toggleFullscreen}
            />,
          ],
          style: {
            height: "100%",
            background: "linear-gradient(#ffffff, #f5f5f5 28%)",
          },
        }
      }
      itemCardProps={{
        bodyStyle: {
          padding: 0,
        },
      }}
      pagination={{
        defaultPageSize: 6,
        showSizeChanger: false,
      }}
      request={(params) =>
        request("/v1/flower", {
          params,
        }).then((response) => response.data)
      }
      rowSelection={{}}
      grid={{ gutter: 16, column: responsive.md ? 3 : 1 }}
      onItem={(record) => ({
        onClick: () =>
          props.cutter[0] || navigate(`/entity/flower/${record.id}/detail`),
      })}
      metas={{
        title: {
          dataIndex: "name",
          render: (element) => <Button type="ghost">{element}</Button>,
        },
        subTitle: {
          render: (_, entity) =>
            entity.tag && (
              <Tag
                color={
                  Array.from(PresetColors).sort(() => Math.random() - 0.5)[0]
                }
              >
                {entity.tag}
              </Tag>
            ),
        },
        type: {},
        avatar: {
          render: () => <Button type="ghost" icon={<StarTwoTone />} />,
        },
        content: {
          render: (_, entity) => (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Divider style={{ margin: "12px 0 0 0" }} />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Image
                  width="50%"
                  preview={!props.cutter[0]}
                  src={instance.getUri({
                    url: `/v1/resource/${entity.picture}`,
                  })}
                  style={{
                    borderBottomLeftRadius: 16,
                  }}
                  onClick={(event) => event.stopPropagation()}
                />

                <Space
                  direction="vertical"
                  style={{
                    width: "50%",
                    margin: "auto 24px",
                  }}
                >
                  {wrap(
                    {
                      color: "yellow",
                      text: "花语",
                    },
                    <Typography.Text italic title={entity.language}>
                      {entity.language?.length > 9
                        ? `${entity.language?.substring(0, 9)}...`
                        : entity.language}
                    </Typography.Text>
                  )}
                  {wrap(
                    {
                      color: "pink",
                      text: "单价",
                    },
                    <Typography>
                      <Typography.Text>{entity.price} </Typography.Text>
                      <Typography.Text type="secondary">￥</Typography.Text>
                    </Typography>
                  )}
                  {wrap(
                    {
                      color: "cyan",
                      text: "规格",
                    },

                    <Typography.Text title={entity.size}>
                      {entity.size?.length > 16
                        ? `${entity.size?.substring(0, 16)}...`
                        : entity.size}
                    </Typography.Text>
                  )}
                  {wrap(
                    {
                      color: "volcano",
                      text: "本月卖出",
                    },
                    <XinSold
                      resourceId={entity.id}
                      resourceType={0}
                      filter={(elements) => {
                        const now = DateTime.now();

                        return elements.filter(
                          (element) =>
                            DateTime.fromISO(element.createdAt).month ===
                            now.month
                        );
                      }}
                    />
                  )}
                  {wrap(
                    {
                      color: "orange",
                      text: "共卖出",
                    },
                    <XinSold resourceId={entity.id} resourceType={0} />
                  )}
                  {wrap(
                    {
                      color: "lime",
                      text: "库存",
                    },
                    <XinInventory resourceId={entity.id} resourceType={0} />
                  )}
                </Space>
              </div>
            </div>
          ),
        },
        actions: {
          render: (_, entity) =>
            props.cutter[0]
              ? [
                  <Button
                    key="plus"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const good = props.bag[0].find(
                        (_good_) =>
                          _good_.resourceType === 0 && _good_.id === entity.id
                      );

                      if (good) {
                        good.amount++;

                        props.bag[1]([...props.bag[0]]);
                      } else {
                        props.bag[1]([
                          ...props.bag[0],
                          {
                            ...entity,
                            amount: 1,
                            resourceType: 0,
                            resourceId: entity.id,
                          },
                        ]);
                      }
                    }}
                  />,
                ]
              : [
                  <Creator
                    key="edit"
                    holder={props.holder}
                    entity={entity}
                    trigger={<Button type="dashed" icon={<EditOutlined />} />}
                  />,
                  <Popconfirm
                    key="delete"
                    title="真的要删除这种鲜花么"
                    description="它真的会消失很久很久"
                    onConfirm={() =>
                      request(`/v1/flower/${entity.id}`, {
                        method: "DELETE",
                      }).then(() => {
                        message.success("删除成功");
                        props.holder.current?.reload();
                      })
                    }
                  >
                    <Button danger type="dashed" icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ],
        },
      }}
      {...props}
    />
  );
};

export default Flower;
