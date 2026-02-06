import React, { MutableRefObject } from "react";
import {
  ActionType,
  ModalForm,
  ModalFormProps,
  ProFormText,
} from "@ant-design/pro-components";
import request from "@/utils/request";
import { message } from "antd";

const Creator: React.FC<
  ModalFormProps & {
    entity?: Record<string, any>;
    holder: MutableRefObject<ActionType | undefined>;
  }
> = (props) => {
  return (
    <ModalForm
      initialValues={props.entity}
      layout="vertical"
      title={
        props.entity ? `修改供应商 | ${props.entity.name}` : "添加新的供应商"
      }
      onFinish={(formData) =>
        (props.entity
          ? request(`/v1/supplier/${props.entity.id}`, {
              method: "PATCH",
              data: formData,
            })
          : request("/v1/supplier", {
              method: "PUT",
              data: formData,
            })
        )
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
      <ProFormText
        name="name"
        label="名称"
        formItemProps={{
          style: {
            marginTop: 24,
          },
        }}
        rules={[
          {
            required: true,
          },
        ]}
      />
      <ProFormText name="address" label="地址" />
      <ProFormText name="mobile" label="联系方式" />
      <ProFormText name="tag" label="标签" />
    </ModalForm>
  );
};

export default Creator;
