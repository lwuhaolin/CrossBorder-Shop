import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";
import icon from "../assets/icon.png";
import request from "@/utils/request";

const XinAuthentication: React.FC<{
  onLogin: (user: Record<string, any>) => void;
}> = (props) => {
  return (
    <Modal open footer={false}>
      <LoginForm
        logo={icon}
        title="FlowerStore"
        subTitle="全球最大的鲜花托管平台"
        actions={false}
        onFinish={(formData) =>
          request("/v1/staff/" + formData.identitty)
            .then((response) => response.data)
            .then((staff) => {
              if (staff) {
                if (staff.password === formData.password) {
                  props.onLogin(staff);
                  message.success("登录成功");
                } else {
                  message.error("密码错误");
                }
              } else {
                message.error("工号错误");
                return false;
              }
            })
        }
      >
        <ProFormText
          name="identitty"
          fieldProps={{
            size: "large",
            addonBefore: <UserOutlined />,
          }}
          placeholder="工号"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            addonBefore: <LockOutlined />,
          }}
          placeholder="密码"
          rules={[
            {
              required: true,
            },
          ]}
        />
      </LoginForm>
    </Modal>
  );
};

export default XinAuthentication;
