import React,{useState,Fragment} from 'react';
import Users from '../../components/Admin-side/Users';
import Navbar from '../../components/Admin-side/Navbar';
import AdminDashboard from '../../components/Admin-side/AdminDashboard';
import Companies from '../../components/Admin-side/Companies';
import './ANT/ant.css'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TeamOutlined ,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
const { Header, Sider, Content } = Layout;


const Dashboard = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1'); // State variable to track selected item's key
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuItemClick = (item) => {
    setSelectedKey(item.key); // Update selectedKey when a menu item is clicked
  };

  return (
    <Fragment>
    <Navbar/>
    <Layout className='bg-pink-50'>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical bg-pink-100" />
        <Menu
          theme="dark"
          mode="inline"
          className='bg-pink-100 text-black font-mono'
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]} // Set the selectedKeys prop to track the selected item
          onClick={handleMenuItemClick} // Handle menu item click event
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'DashBoard',
            },
            {
              key: '2',
              icon: <UsergroupAddOutlined />,
              label: 'Companies',
            },
            {
              key: '3',
              icon:<TeamOutlined />,
              label: 'Users',
            },
            {
              key: '4',
              icon:<UserOutlined />,
              label: 'userManage',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 595,
            background: colorBgContainer,
          }}
        >
          {(() => {
            switch (selectedKey) { 
              case '1':
                return <AdminDashboard/>;
              case '2':
                return <Companies/>;
              case'3':
                return <Users/>;
              case'4':
                return <div>hai this is user</div> 
              default:
                return  <h1>yes</h1>;
            }
          })()}
        </Content>
      </Layout>
    </Layout>
  </Fragment>
  );
}

export default Dashboard;
