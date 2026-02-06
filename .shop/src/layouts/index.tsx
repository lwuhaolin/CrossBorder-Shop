import React from "react";
import {
  ProConfigProvider,
  ProLayout,
  ProLayoutProps,
  WaterMark,
} from "@ant-design/pro-components";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  UserOutlined,
  HeartOutlined,
  DisconnectOutlined,
  LinkOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { App, ConfigProvider, FloatButton } from "antd";
import icon from "../assets/icon.png";
import XinMenu from "./XinMenu";
import XinIcon from "./XinIcon";
// @ts-ignore
import { useLocation, useNavigate } from "react-router";
import { Outlet } from "umi";
import { getUserInfo, removeToken, removeUserInfo } from "@/utils/request";

const XinLayout: React.FC<ProLayoutProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUserInfo();

  // Redirect to login if no user and not on login page
  React.useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    removeToken();
    removeUserInfo();
    navigate('/login');
  };

  // Don't show layout on login page
  if (location.pathname === '/login') {
    return <Outlet />;
  }

  // Don't render layout if user is not logged in
  if (!user) {
    return null;
  }

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
            title="跨境商品订货系统"
            avatarProps={{
              title: user.username || user.name,
              size: "default",
              src: user.avatar || "https://q1.qlogo.cn/g?b=qq&nk=2198423533&s=640",
            }}
            actionsRender={(_props_) => {
              return _props_.isMobile
                ? []
                : [
                    <XinMenu
                      key="menu"
                      onLogout={handleLogout}
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
                  name: "商品管理",
                  path: "products",
                  icon: <ShoppingOutlined />,
                },
                {
                  name: "分类管理",
                  path: "categories",
                  icon: <AppstoreOutlined />,
                },
                {
                  name: "订单管理",
                  path: "orders",
                  icon: <ShoppingCartOutlined />,
                },
                {
                  name: "地址管理",
                  path: "addresses",
                  icon: <EnvironmentOutlined />,
                },
                {
                  name: "个人中心",
                  path: "user",
                  icon: <UserOutlined />,
                  routes: [
                    {
                      name: "个人信息",
                      path: "profile",
                    },
                    {
                      name: "修改密码",
                      path: "password",
                    },
                  ],
                },
              ],
            }}
            {...props}
          >
            <WaterMark content={user.username || user.name}>
              <Outlet />
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
      </App>
    </ConfigProvider>
  );
};

export default XinLayout;
