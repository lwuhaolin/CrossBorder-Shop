import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  ProCard,
  ProCardProps,
  ProColumns,
  ProFormSelect,
  ProTable,
} from "@ant-design/pro-components";
import {
  Alert,
  Button,
  Divider,
  Drawer,
  InputNumber,
  message,
  Space,
  Typography,
} from "antd";
import { DeleteOutlined, TransactionOutlined } from "@ant-design/icons";
import { ResourceType } from "@/pages/order";
import Selector from "@/pages/entity/flower/components/Selector";
import { useLocalStorageState } from "ahooks";
import request from "@/utils/request";

const Cart: React.FC<
  ProCardProps & {
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
  }
> = (props) => {
  const customer = useRef<string>();
  const [user, _] = useLocalStorageState<Record<string, any> | undefined>(
    "JiShuXin['user']",
    {
      deserializer: JSON.parse,
      serializer: JSON.stringify,
    }
  );
  const [viewing, setViewing] = useState<boolean>();

  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: "商品编号",
      dataIndex: "resourceId",
    },
    {
      title: "商品类型",
      valueType: "select",
      valueEnum: ResourceType,
      dataIndex: "resourceType",
    },
    {
      title: "名字",
      dataIndex: "name",
    },
    {
      title: "单价",
      dataIndex: "price",
    },
    {
      title: "购买数量",
      dataIndex: "amount",
      render: (_, entity) => (
        <InputNumber
          min={1}
          defaultValue={entity.amount}
          disabled={entity.resourceType === 1}
          onChange={(value) => {
            const element = props.bag[0].find(
              (_element_) => _element_.id === entity.id
            );

            if (element) {
              element.amount = value;

              props.bag[1]([...props.bag[0]]);
            }
          }}
        />
      ),
    },
    {
      title: "优惠金额",
      dataIndex: "-",
    },
    {
      title: "总价",
      render: (_, entity) => entity.price * entity.amount,
    },
    {
      title: "操作",
      render: (_, entity) => (
        <Space>
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              props.bag[1](
                props.bag[0].filter(
                  (element) => element.resourceId != entity.resourceId
                )
              );
            }}
          />
        </Space>
      ),
    },
  ];

  const toggleViewing = () => {
    props.cutter[1].toggleFullscreen();
    setViewing(!viewing);
  };

  const calculate = () =>
    props.bag[0].reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.price * currentValue.amount,
      0
    );

  const contain = (type: number) =>
    props.bag[0].find((element) => element.resourceType === type);

  return (
    <>
      {props.cutter[0] && (
        <ProCard
          style={{
            left: 24,
            bottom: 24 * 3.5,
            width: "calc(100% - 24px - 24px)",
          }}
          bodyStyle={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
          }}
          bordered
          // boxShadow
          hoverable
          onClick={toggleViewing}
          {...props}
        >
          <Space>￥{calculate()}</Space>
          <Space>
            <Typography.Text type="secondary">点击卡片查看详情</Typography.Text>
            <>|</>
            <Button key="settle" type="primary" icon={<TransactionOutlined />}>
              立即结算
            </Button>
          </Space>
        </ProCard>
      )}

      <Drawer
        height="60%"
        open={viewing}
        placement="bottom"
        onClose={toggleViewing}
        extra={
          <Space>
            <Button type="text">￥ {calculate()}</Button>
            <Divider type="vertical" style={{ margin: 0 }} />
            <Button
              key="settle"
              type="primary"
              icon={<TransactionOutlined />}
              disabled={!(contain(0) && contain(1))}
              onClick={() => {
                if (customer.current) {
                  return request(`/v1/order`, {
                    method: "PUT",
                    data: {
                      peerType: 1,
                      status: 0,
                      staffId: user?.id,
                      title: `顾客 ${customer.current} 的鲜花购买订单`,
                      peerId: customer.current,
                    },
                  })
                    .then((response) => response.data)
                    .then((body) =>
                      Promise.all(
                        props.bag[0].map((element: any) =>
                          request(`/v1/order/${body.identifiers[0].id}/entry`, {
                            method: "PUT",
                            data: {
                              price: element.price,
                              amount: element.amount,
                              resourceId: element.resourceId,
                              resourceType: element.resourceType,
                            },
                          })
                        )
                      )
                        .then(() =>
                          message.success("订单创建成功").then(() => {
                            toggleViewing();
                            props.bag[1]([]);
                          })
                        )
                        .catch(() =>
                          request(`/v1/order/${body.identifiers[0].id}`, {
                            method: "DELETE",
                          })
                            .then(() =>
                              message.error("订单条目插入失败，订单已回滚")
                            )
                            .catch(() => false)
                        )
                    )
                    .catch(() => false);
                } else {
                  return message.error("请先选择顾客信息");
                }
              }}
            >
              立即结算
            </Button>
          </Space>
        }
      >
        {contain(0) ? (
          <></>
        ) : (
          <Alert
            showIcon
            action={
              <Button type="link" onClick={toggleViewing}>
                立即挑选
              </Button>
            }
            closable={false}
            message="您需要挑选鲜花才可以结算订单"
            style={{
              marginBottom: 24,
            }}
          />
        )}

        {contain(1) ? (
          <></>
        ) : (
          <Alert
            showIcon
            action={
              <Selector
                bag={props.bag}
                trigger={<Button type="link">立即挑选</Button>}
              />
            }
            closable={false}
            message="您需要挑选包装才可以结算订单"
            style={{
              marginBottom: 24,
            }}
          />
        )}

        <ProTable
          headerTitle="订单详情"
          cardProps={{
            bordered: true,
            boxShadow: true,
            headerBordered: true,
          }}
          search={false}
          options={false}
          toolBarRender={() =>
            contain(1)
              ? [
                  <ProFormSelect
                    noStyle
                    showSearch
                    fieldProps={{
                      onChange: (value) => (customer.current = value),
                    }}
                    placeholder="请选择顾客"
                    key="customerSelector"
                    request={(params) =>
                      request(`/v1/customer`, {
                        params: {
                          current: 1,
                          pageSize: 1024,
                          ...params,
                        },
                      })
                        .then((response) => response.data)
                        .then((response) => response.data)
                        .then((customers) =>
                          customers.map((customer: any) => ({
                            value: customer.id,
                            label: customer.name,
                          }))
                        )
                    }
                  />,
                  <Divider key="spliter" type="vertical" />,
                  <Selector
                    key="packageSelector"
                    bag={props.bag}
                    trigger={<Button>选购包装</Button>}
                  />,
                ]
              : []
          }
          columns={columns}
          dataSource={props.bag[0]}
        />
      </Drawer>
    </>
  );
};

export default Cart;
