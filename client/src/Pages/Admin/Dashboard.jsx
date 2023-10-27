import React, { useState, Fragment } from "react";
import Users from "../../components/Admin-side/Users";
import AdminDashboard from "../../components/Admin-side/AdminDashboard";
import Companies from "../../components/Admin-side/Companies";
import AccountsManage from "../../components/Admin-side/AccountsManage";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  NotificationOutlined,
  TrophyOutlined,
  TeamOutlined,
  BankOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import Notification from "../../components/Admin-side/Notification";
import JobManage from "../../components/Admin-side/JobManage";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../Store/storeSlices/adminAuth";
const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");

  const dispatch = useDispatch();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuItemClick = (item) => {
    setSelectedKey(item.key);
  };

  return (
    <Fragment>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedKey]}
            onClick={handleMenuItemClick}
            items={[
              {
                key: "1",
                icon: <BarChartOutlined />,
                label: "DashBoard",
              },
              {
                key: "2",
                icon: <BankOutlined />,
                label: "Companies",
              },
              {
                key: "3",
                icon: <TeamOutlined />,
                label: "Users",
              },
              {
                key: "4",
                icon: <TrophyOutlined />,
                label: "Accounts",
              },
              {
                key: "5",
                icon: <NotificationOutlined />,
                label: "Notifications",
              },
              {
                key: "6",
                icon: <DesktopOutlined />,
                label: "Jobs",
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, color: colorBgContainer }}>
            <div style={{display:"flex", justifyContent:"space-around"}}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                  color: colorBgContainer,
                }}
              />
              <p>Hello Admin</p>
              <>
                <button
                  onClick={() => {
                    localStorage.removeItem("adminInformation");
                    dispatch(adminLogout());
                  }}
                  style={{
                    fontSize: "16px",
                    padding: 1,
                  }}
                >
                  SignOut
                </button>
              </>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              height:700,
              background: colorBgContainer,
            }}
          >
            {(() => {
              switch (selectedKey) {
                case "1":
                  return <AdminDashboard />;
                case "2":
                  return <Companies />;
                case "3":
                  return <Users />;
                case "4":
                  return <AccountsManage />;
                case "5":
                  return <Notification />;
                case "6":
                  return <JobManage />;
                default:
                  return null;
              }
            })()}
          </Content>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default Dashboard;
