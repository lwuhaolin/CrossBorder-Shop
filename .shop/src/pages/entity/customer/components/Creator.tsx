import React, { MutableRefObject } from "react";
import {
  ActionType,
  ModalForm,
  ModalFormProps,
  ProForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
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
      loading={!props.entity}
      initialValues={props.entity}
      layout="vertical"
      modalProps={{
        bodyStyle: {
          paddingTop: 12,
        },
      }}
      title={`修改客户 | ${props.entity?.name}`}
      onFinish={(formData) =>
        request("/v1/customer/" + props.entity?.id, {
          method: "PATCH",
          data: formData,
        })
          .then(() => {
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
      <ProForm.Group>
        <ProFormText name="name" label="姓名" />
        <ProFormDateTimePicker name="birthedAt" label="出生日期" />

        <ProFormRadio.Group
          name="sex"
          label="性别"
          radioType="button"
          rules={[
            {
              required: true,
            },
          ]}
          options={[
            {
              label: "女",
              value: 0,
            },
            {
              label: "男",
              value: 1,
            },
            {
              label: "未知",
              value: 2,
            },
          ]}
        />
      </ProForm.Group>
      {/* Xin */}
      <ProFormText
        name="phone"
        label="联系电话"
        fieldProps={{
          type: "phone",
        }}
      />
      <ProFormTextArea name="address" label="住址" />
    </ModalForm>
  );
};

export default Creator;
