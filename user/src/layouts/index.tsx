import React from "react";
import { Outlet } from "@umijs/renderer-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Layout } from "antd";

const { Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ background: "#f5f5f5" }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;
