import React, { MutableRefObject } from "react";
import {
  ActionType,
  DrawerForm,
  DrawerFormProps,
  ProFormDigit,
  ProFormText,
  ProFormUploadDragger,
} from "@ant-design/pro-components";
import request, { instance } from "@/utils/request";
import { message } from "antd";

const Creator: React.FC<
  DrawerFormProps & {
    entity?: Record<string, any>;
    holder: MutableRefObject<ActionType | undefined>;
  }
> = (props) => {
  return (
    <DrawerForm
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
      title={props.entity ? `修改鲜花 | ${props.entity.name}` : "添加新的鲜花"}
      onFinish={(formData) => {
        formData.picture = formData.picture[0].response.identifier;

        return (
          props.entity
            ? request("/v1/flower/" + props.entity.id, {
                method: "PATCH",
                data: formData,
              })
            : request("/v1/flower", {
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
          });
      }}
      {...props}
    >
      <ProFormText
        name="name"
        label="名称"
        rules={[
          {
            required: true,
          },
        ]}
      />
      <ProFormText name="tag" label="标签" />
      <ProFormText name="language" label="花语" />
      <ProFormText name="size" label="规格" />
      <ProFormDigit
        name="price"
        label="单价"
        rules={[
          {
            required: true,
          },
        ]}
      />
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
    </DrawerForm>
  );
};

export default Creator;
