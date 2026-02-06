import React, { MutableRefObject } from "react";
import {
  ActionType,
  ModalForm,
  ModalFormProps,
  ProFormText,
} from "@ant-design/pro-components";
import request from "@/utils/request";
import { Button, Divider, message } from "antd";

const Creator: React.FC<
  ModalFormProps & {
    entity?: Record<string, any>;
    holder: MutableRefObject<ActionType | undefined>;
  }
> = (props) => {
  return (
    <ModalForm
      layout="vertical"
      title={`修改员工 ${props.entity?.name} 的密码`}
      modalProps={{
        bodyStyle: {
          paddingTop: 24,
        },
      }}
      onFinish={(formData) =>
        request("/v1/staff/" + props.entity?.id, {
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
      submitter={{
        render: (_, elements) => [
          <Button key="generate" onClick={() => message.info("开发中")}>
            生成随机密码
          </Button>,
          <Divider type="vertical" />,
          ...elements,
        ],
      }}
      {...props}
    >
      <ProFormText
        name="password"
        label="密码"
        fieldProps={{
          type: "password",
        }}
        rules={[
          {
            required: true,
          },
        ]}
      />
    </ModalForm>
  );
};

export default Creator;
