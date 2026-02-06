import React from "react";
import { ModalForm, ModalFormProps, ProCard } from "@ant-design/pro-components";
import { Empty, Result } from "antd";
import { BranchesOutlined } from "@ant-design/icons";

const XinSetting: React.FC<ModalFormProps> = (props) => {
  const content = (
    <>
      <Empty
        description="暂无可用的配置项"
        style={{
          margin: "48px 0",
        }}
      />
    </>
  );

  return (
    <ModalForm
      modalProps={{
        bodyStyle: {
          marginTop: -20,
          marginLeft: -24,
          width: "calc(100% + 24px + 24px)",
          borderBlockEnd: "1px solid rgba(5, 5, 5, 0.06)",
        },
      }}
      {...props}
    >
      <ProCard
        title="设置"
        headerBordered
        tabs={{
          tabPosition: "left",
          items: [
            {
              key: "system",
              label: `系统设置`,
              children: content,
            },
            {
              key: "security",
              label: `安全设置`,
              children: content,
            },
            {
              label: `通知设置`,
              children: content,
              key: "notification",
            },
          ],
        }}
      />
    </ModalForm>
  );
};

export default XinSetting;
