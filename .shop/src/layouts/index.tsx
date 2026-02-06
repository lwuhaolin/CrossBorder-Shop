import React from "react";
import {
  ProConfigProvider,
  ProLayout,
  ProLayoutProps,
  WaterMark,
} from "@ant-design/pro-components";
import {
  BellOutlined,
  BlockOutlined,
  DashboardOutlined,
  DisconnectOutlined,
  ExperimentOutlined,
  HeartOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { App, ConfigProvider, FloatButton } from "antd";
import icon from "../assets/icon.png";
import XinMenu from "./XinMenu";
import XinIcon from "./XinIcon";
// @ts-ignore
import { useLocation, useNavigate } from "react-router";
import { Outlet } from "umi";
import { useLocalStorageState } from "ahooks";
import XinAuthentication from "@/layouts/XinAuthentication";
import instance from "@/utils/request";

const XinLayout: React.FC<ProLayoutProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorageState<Record<string, any> | undefined>(
    "JiShuXin['user']",
    {
      deserializer: JSON.parse,
      serializer: JSON.stringify,
    },
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#78AA64",
          borderRadius: 16,
        },
      }}
    >
      <App>
        {user ? (
          <ProConfigProvider>
            <ProLayout
              token={{
                colorPrimary: "#78AA64",
                sider: {
                  colorMenuBackground:
                    "linear-gradient(to bottom, rgba(120, 170, 100, 0.8), rgba(120, 170, 100, 1.0))",
                  colorBgMenuItemCollapsedHover: "rgba(0, 0, 0, 0.06)",
                  colorBgMenuItemCollapsedSelected: "rgba(0, 0, 0, 0.15)",
                  colorBgMenuItemCollapsedElevated: "rgba(0, 0, 0, 0.85)",
                  colorMenuItemDivider: "rgba(255, 255, 255, 0.15)",
                  colorBgMenuItemHover: "rgba(0, 0, 0, 0.06)",
                  colorBgMenuItemSelected: "rgba(0, 0, 0, 0.15)",
                  colorTextMenuSelected: "#fff",
                  colorTextMenuItemHover: "rgba(255, 255, 255, 0.75)",
                  colorTextMenu: "rgba(255, 255, 255, 0.75)",
                  colorTextMenuSecondary: "rgba(255, 255, 255, 0.65)",
                  colorTextMenuTitle: "rgba(255, 255, 255, 0.95)",
                  colorTextMenuActive: "rgba(255, 255, 255, 0.95)",
                  colorTextSubMenuSelected: "#fff",
                },
              }}
              logo={icon}
              location={location}
              avatarProps={{
                title: user.name,
                size: "default",
                src: user.picture
                  ? instance.getUri({
                      url: `/v1/resource/${user.picture}`,
                    })
                  : "https://q1.qlogo.cn/g?b=qq&nk=2198423533&s=640",
              }}
              actionsRender={(_props_) => {
                return _props_.isMobile
                  ? []
                  : [
                      <XinMenu
                        key="menu"
                        onLogout={() => setUser(undefined)}
                      />,
                    ];
              }}
              menuItemRender={(item, element) => (
                <div
                  onClick={() => {
                    navigate(item.path || "/");
                  }}
                >
                  {element}
                </div>
              )}
              collapsed
              collapsedButtonRender={() => []}
              route={{
                path: "/",
                routes: [
                  {
                    name: "仪表盘",
                    path: "dashboard",
                    icon: <DashboardOutlined />,
                  },
                  {
                    name: "实体",
                    path: "entity",
                    icon: <BlockOutlined />,
                    routes: [
                      {
                        name: "供应商",
                        path: "supplier",
                      },
                      {
                        name: "员工",
                        path: "staff",
                      },
                      {
                        name: "客户",
                        path: "customer",
                      },
                      {
                        name: "鲜花",
                        path: "flower",
                        hideChildrenInMenu: true,
                        routes: [
                          {
                            path: ".",
                          },
                          {
                            name: "详情",
                            path: ":identifier/detail",
                          },
                          {
                            name: "损失管理",
                            path: "loss",
                          },
                        ],
                      },

                      {
                        name: "包装材料",
                        path: "package",
                      },
                    ],
                  },
                  {
                    name: "订单",
                    path: "order",
                    icon: <BellOutlined />,
                  },
                ],
              }}
              {...props}
            >
              <WaterMark content={user.name}>
                {/*  */}
                <Outlet />
                {/*  */}
                <FloatButton.Group
                  type="primary"
                  trigger="hover"
                  icon={
                    <XinIcon
                      value="connected"
                      mapping={{
                        connected: <HeartOutlined />,
                        disconnected: <DisconnectOutlined />,
                        connecting: [<LinkOutlined />, <DisconnectOutlined />],
                      }}
                    />
                  }
                >
                  <FloatButton icon={<ExperimentOutlined />} />
                </FloatButton.Group>
              </WaterMark>
            </ProLayout>
          </ProConfigProvider>
        ) : (
          <XinAuthentication onLogin={setUser} />
        )}
      </App>
    </ConfigProvider>
  );
};

export default XinLayout;
