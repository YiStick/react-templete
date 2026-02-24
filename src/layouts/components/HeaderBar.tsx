import { Avatar, Button, Menu, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation } from 'react-router-dom';
import type { NavTheme } from '@/layouts/layoutConfig';
import { appRoutes } from '@/router/routes';
import { findRouteByPath } from '@/router/utils';
import { useAppStore } from '@/stores/appStore';

type HeaderBarProps = {
  layout: 'sidemenu' | 'topmenu';
  title: string;
  logo?: string;
  menuItems?: MenuProps['items'];
  onMenuClick?: (key: string) => void;
  navTheme: NavTheme;
  showTopMenu?: boolean;
};

export default function HeaderBar({
  layout,
  title,
  logo,
  menuItems,
  onMenuClick,
  navTheme,
  showTopMenu,
}: HeaderBarProps) {
  const location = useLocation();
  const effectiveTheme = navTheme === 'realDark' ? 'dark' : navTheme;
  const locale = useAppStore((state) => state.locale);
  const setLocale = useAppStore((state) => state.setLocale);
  const activeRoute = findRouteByPath(location.pathname, appRoutes);
  const pageTitle = activeRoute?.meta.title ?? title;
  const selectedKeys = activeRoute ? [activeRoute.path] : [];
  const shouldShowTopMenu =
    (showTopMenu ?? layout === 'topmenu') && menuItems && menuItems.length > 0;

  return (
    <div
      className={`header-bar ${
        layout === 'topmenu' ? `header-${effectiveTheme}` : ''
      }`}
    >
      <div className="header-left">
        {layout === 'topmenu' ? (
          <>
            {logo ? (
              <img className="header-logo-image" src={logo} alt="logo" />
            ) : (
              <div className="header-logo-icon">R</div>
            )}
            <Typography.Title level={5} className="header-title">
              {title}
            </Typography.Title>
          </>
        ) : (
          <Typography.Title level={5} className="header-title">
            {pageTitle}
          </Typography.Title>
        )}
      </div>

      {shouldShowTopMenu && (
        <Menu
          className="header-menu"
          mode="horizontal"
          items={menuItems}
          selectedKeys={selectedKeys}
          theme={effectiveTheme}
          onClick={(info) => onMenuClick?.(info.key)}
        />
      )}

      <Space size={8} align="center">
        <Button
          size="small"
          onClick={() => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN')}
        >
          {locale === 'zh-CN' ? 'EN' : '中文'}
        </Button>
        <Avatar size="small">U</Avatar>
      </Space>
    </div>
  );
}
