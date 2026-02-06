import React, { useState } from "react";
import {
  CloseCircleOutlined,
  MenuOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Dropdown, DropdownProps, MenuProps } from "antd";
import { ProHelp, ProHelpPanel } from "@ant-design/pro-components";
import { useBoolean } from "ahooks";
import XinSetting from "@/layouts/XinSetting";

const XinMenu: React.FC<
  DropdownProps & {
    onLogout: () => void;
  }
> = (props) => {
  const [setting, settingAction] = useBoolean();

  const items: MenuProps["items"] = [
    {
      label: "设置",
      key: "setting",
      icon: <SettingOutlined />,
      onClick: settingAction.toggle,
    },
    {
      key: "exit",
      danger: true,
      label: "退出",
      onClick: props.onLogout,
      icon: <CloseCircleOutlined />,
    },
  ];

  return (
    <>
      <Dropdown trigger={["click"]} menu={{ items }} {...props}>
        <MenuOutlined />
      </Dropdown>

      <XinSetting
        open={setting}
        onOpenChange={(open) => open || settingAction.setFalse()}
      />
    </>
  );
};

export default XinMenu;
