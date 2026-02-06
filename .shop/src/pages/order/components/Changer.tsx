import React, { MutableRefObject } from "react";
import {
  ActionType,
  ModalForm,
  ModalFormProps,
  ProFormSelect,
} from "@ant-design/pro-components";
import request from "@/utils/request";
import { message } from "antd";
import { OrderStatus } from "@/pages/order";

const Creator: React.FC<
  ModalFormProps & {
    entity?: Record<string, any>;
    holder: MutableRefObject<ActionType | undefined>;
  }
> = (props) => {
  return (
    <ModalForm
      layout="vertical"
      title={`修改订单 ${props.entity?.title} 的状态`}
      modalProps={{
        bodyStyle: {
          paddingTop: 24,
        },
      }}
      onFinish={(formData) =>
        request("/v1/order/" + props.entity?.id, {
          method: "PATCH",
          data: {
            ...props.entity,
            ...formData,
          },
        })
          .then((response) => {
            props.holder.current?.reload();
            message.success(props.entity ? "修改成功" : "添加成功");
            return true;
          })
          .catch((error) => {
            message.error(error);
            return false;
          })
      }
      {...props}
    >
      <ProFormSelect
        name="status"
        label="状态"
        rules={[
          {
            required: true,
          },
        ]}
        valueEnum={OrderStatus}
      />
    </ModalForm>
  );
};

export default Creator;
