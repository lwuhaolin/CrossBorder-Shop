import {
  ModalForm,
  ModalFormProps,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormList,
  ProFormMoney,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import React from "react";
import request from "../../../../utils/request";
import { Divider, message } from "antd";
import { useLocalStorageState } from "ahooks";
import { OrderStatus, ResourceType } from "@/pages/order";

const OrderCreator: React.FC<
  ModalFormProps & {
    entity?: Record<string, any>;
  }
> = (props) => {
  const [user, _] = useLocalStorageState<Record<string, any> | undefined>(
    "JiShuXin['user']",
    {
      deserializer: JSON.parse,
      serializer: JSON.stringify,
    }
  );

  return (
    <ModalForm
      title="添加采购订单"
      onFinish={(formData) =>
        request(`/v1/order`, {
          method: "PUT",
          data: {
            peerType: 0,
            staffId: user?.id,
            title: formData.title,
            status: formData.status,
            peerId: props.entity?.id,
          },
        })
          .then((response) => response.data)
          .then((body) =>
            Promise.all(
              formData.elements.map((element: any) =>
                request(`/v1/order/${body.identifiers[0].id}/entry`, {
                  method: "PUT",
                  data: element,
                })
              )
            )
              .then(() => {
                message.success("订单创建成功");
                return true;
              })
              .catch(() =>
                request(`/v1/order/${body.identifiers[0].id}`, {
                  method: "DELETE",
                })
                  .then(() => {
                    message.error("订单条目插入失败，订单已回滚");
                    return false;
                  })
                  .catch(() => false)
              )
          )
          .catch(() => false)
      }
      {...props}
    >
      <Divider
        style={{
          margin: "12px -24px 12px -24px",
          width: "calc(100% + 24px + 24px)",
        }}
      />
      {/*  */}
      <ProForm.Group>
        <ProFormText
          name="title"
          label="订单名称"
          rules={[
            {
              required: true,
            },
          ]}
        />

        <ProFormSelect
          name="status"
          label="订单状态"
          rules={[
            {
              required: true,
            },
          ]}
          valueEnum={OrderStatus}
        />
      </ProForm.Group>
      {/*  */}
      <Divider
        orientation="right"
        style={{
          margin: "-12px 0 12px 0",
        }}
      >
        订单内容
      </Divider>
      {/*  */}
      <ProFormList name="elements">
        <ProForm.Group>
          <ProFormRadio.Group
            radioType="button"
            name="resourceType"
            label="资源类型"
            rules={[
              {
                required: true,
              },
            ]}
            valueEnum={ResourceType}
          />

          <ProFormDependency name={["resourceType"]}>
            {({ resourceType }) => (
              <ProFormSelect
                showSearch
                name="resourceId"
                params={{
                  resourceType,
                }}
                label="资源"
                rules={[
                  {
                    required: true,
                  },
                ]}
                request={(params) =>
                  request(`/v1/${["flower", "package"][resourceType]}`, {
                    params: {
                      current: 1,
                      pageSize: 1024,
                      ...params,
                    },
                  })
                    .then((response) => response.data)
                    .then((response) => response.data)
                    .then((resources) =>
                      resources.map((resource: any) => ({
                        value: resource.id,
                        label: resource.name,
                      }))
                    )
                }
              />
            )}
          </ProFormDependency>

          <ProFormMoney
            width={128 + 24}
            name="price"
            label="单价"
            rules={[
              {
                required: true,
              },
            ]}
          />

          <ProFormDigit
            width={128 + 24}
            name="amount"
            label="数量"
            rules={[
              {
                required: true,
              },
            ]}
          />
        </ProForm.Group>
      </ProFormList>
      {/*  */}
      <Divider
        style={{
          margin: "12px -24px 24px -24px",
          width: "calc(100% + 24px + 24px)",
        }}
      />
    </ModalForm>
  );
};

export default OrderCreator;
