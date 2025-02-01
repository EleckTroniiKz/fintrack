import React, { useState } from 'react';
import {
  CalendarOutlined,
  GroupOutlined,
  PieChartOutlined,
  UserOutlined,
  WalletOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';

import {Categories, Monthly, Overview, Payments, User} from './pages'


const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Overview', '1', <PieChartOutlined />),
  getItem('Monthly', '2', <CalendarOutlined />),
  getItem('Can', '3', <UserOutlined />),
  getItem('Categories', '4', <GroupOutlined />),
  getItem('Payments', '5', <WalletOutlined />)
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(1);

  const getContentToMenuItem = () => {
    switch(selectedKey){
      case 1:
        return <Overview />;
      case 2:
        return <Monthly />;
      case 3:
        return <User />;
      case 4:
        return <Categories />;
      case 5:
        return <Payments />;
      default:
        return <></>
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onSelect={(e) => setSelectedKey(parseInt(e.key))}/>
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
          {getContentToMenuItem()}
        </Content>
        
      </Layout>
    </Layout>
  );
}