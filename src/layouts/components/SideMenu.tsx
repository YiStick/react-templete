import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from '@/router/routes';
import { findRouteByPath } from '@/router/utils';

const { Sider } = Layout;

type SideMenuProps = {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  theme: 'dark' | 'light';
  width: number;
  collapsedWidth: number;
  fixed: boolean;
  title: string;
  logo?: string;
  menuItems: MenuProps['items'];
  defaultOpenAll: boolean;
  defaultOpenKeys?: string[];
  showLogo?: boolean;
};

export default function SideMenu({
  collapsed,
  onCollapse,
  theme,
  width,
  collapsedWidth,
  fixed,
  title,
  logo,
  menuItems,
  defaultOpenAll,
  defaultOpenKeys,
  showLogo = true,
}: SideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeRoute = findRouteByPath(location.pathname, appRoutes);
  const selectedKeys = activeRoute ? [activeRoute.path] : [];

  return (
    <Sider
      className={`app-sider ${theme} ${fixed ? 'fixed' : ''}`}
      theme={theme}
      width={width}
      collapsedWidth={collapsedWidth}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      {showLogo && (
        <div className="sider-logo">
          {logo ? (
            <img className="sider-logo-image" src={logo} alt="logo" />
          ) : (
            <div className="sider-logo-icon">R</div>
          )}
          {!collapsed && <span className="sider-logo-text">{title}</span>}
        </div>
      )}
      <Menu
        theme={theme}
        mode="inline"
        className="app-sider-menu"
        items={menuItems}
        selectedKeys={selectedKeys}
        defaultOpenKeys={defaultOpenAll ? defaultOpenKeys : undefined}
        onClick={(info) => navigate(info.key)}
      />
    </Sider>
  );
}
