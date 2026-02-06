import React, { MutableRefObject } from "react";
import {
  ActionType,
  ModalForm,
  ModalFormProps,
  ProFormDigit,
  ProFormMoney,
  ProFormSelect,
} from "@ant-design/pro-components";
import request from "@/utils/request";
import { message } from "antd";
import { HandleMethod, LossReason } from "@/pages/entity/flower/loss";

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
      title={props.entity ? `修改损坏记录 | Untitled` : "添加新的损坏记录"}
      onFinish={(formData) =>
        (props.entity
          ? request("/v1/loss/" + props.entity.id, {
              method: "PATCH",
              data: formData,
            })
          : request("/v1/loss", {
              method: "PUT",
              data: formData,
            })
        )
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
      modalProps={{
        bodyStyle: {
          paddingTop: 12,
        },
      }}
      {...props}
    >
      <ProFormSelect
        name="reason"
        label="损坏原因"
        rules={[
          {
            required: true,
          },
        ]}
        options={Object.keys(LossReason!).map((reason) => ({
          // @ts-ignore
          label: LossReason?.[reason].text,
          value: Number(reason),
        }))}
      />

      <ProFormSelect
        name="method"
        label="处理方式"
        rules={[
          {
            required: true,
          },
        ]}
        options={Object.keys(HandleMethod!).map((method) => ({
          // @ts-ignore
          label: HandleMethod?.[method].text,
          value: Number(method),
        }))}
      />

      <ProFormDigit
        name="amount"
        label="损坏数量"
        rules={[
          {
            required: true,
          },
        ]}
      />

      <ProFormMoney
        name="price"
        label="预估亏损金额"
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
