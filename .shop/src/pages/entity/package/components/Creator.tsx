import React, { MutableRefObject } from "react";
import {
  ActionType,
  ModalForm,
  ProForm,
  ModalFormProps,
  ProFormMoney,
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
} from "@ant-design/pro-components";
import request, { instance } from "@/utils/request";
import { message } from "antd";

const Creator: React.FC<
  ModalFormProps & {
    entity?: Record<string, any>;
    holder: MutableRefObject<ActionType | undefined>;
  }
> = (props) => {
  return (
    <ModalForm
      initialValues={
        props.entity
          ? {
              ...props.entity,
              picture: [
                {
                  status: "done",
                  name: props.entity.picture,
                  thumbUrl: instance.getUri({
                    url: `/v1/resource/${props.entity.picture}`,
                  }),
                  response: {
                    identifier: props.entity.picture,
                  },
                },
              ],
            }
          : undefined
      }
      layout="vertical"
      title={
        props.entity
          ? `修改包装材料 | ${props.entity.name}`
          : "添加新的包装材料"
      }
      onFinish={(formData) => {
        formData.picture = formData.picture[0].response.identifier;

        return (
          props.entity
            ? request(`/v1/package/${props.entity.id}`, {
                method: "PATCH",
                data: formData,
              })
            : request("/v1/package", {
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
          });
      }}
      {...props}
    >
      <ProForm.Group style={{ marginTop: 24 }}>
        <ProFormText
          name="name"
          label="名称"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormMoney
          name="price"
          label="单价"
          rules={[
            {
              required: true,
            },
          ]}
        />
      </ProForm.Group>

      <ProFormTextArea name="description" label="解释" />

      <ProFormUploadDragger
        name="picture"
        label="预览图"
        max={1}
        fieldProps={{
          listType: "picture",
        }}
        action={instance.getUri({
          url: "/v1/resource",
        })}
        accept="image/*"
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
