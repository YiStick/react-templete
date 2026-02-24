import { useEffect, useMemo, useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from './components/HeaderBar';
import TabsBar from './components/TabsBar';
import SideMenu from './components/SideMenu';
import { useTabsStore } from '@/stores/tabsStore';
import { useLayoutStore } from './settingsStore';
import { appRoutes } from '@/router/routes';
import { buildMenuItems, getMenuOpenKeys } from '@/router/menu';
import { useAuthStore } from '@/stores/authStore';
import { findRouteChain } from '@/router/utils';
import SettingDrawer from './components/SettingDrawer';

const { Header, Content } = Layout;

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const syncWithRoute = useTabsStore((state) => state.syncWithRoute);
  const [collapsed, setCollapsed] = useState(false);
  const permissions = useAuthStore((state) => state.permissions);
  const settings = useLayoutStore((state) => state.settings);
  const normalizedLayout = useMemo(() => {
    if (settings.layout === 'sidemenu') {
      return 'side';
    }
    if (settings.layout === 'topmenu') {
      return 'top';
    }
    return settings.layout;
  }, [settings.layout]);
  const layoutMode = useMemo(() => {
    if (normalizedLayout === 'side') {
      return 'sidemenu' as const;
    }
    return 'topmenu' as const;
  }, [normalizedLayout]);
  const splitEnabled = settings.splitMenus;
  const effectiveTheme = settings.navTheme === 'realDark' ? 'dark' : settings.navTheme;
  const headerTheme = effectiveTheme;
  const isDarkTheme = effectiveTheme === 'dark';
  const routeChain = useMemo(
    () => findRouteChain(location.pathname, appRoutes),
    [location.pathname],
  );
  const splitSideRoutes =
    normalizedLayout === 'mix' && splitEnabled
      ? routeChain[0]?.children ?? []
      : appRoutes;
  const menuItems = useMemo(() => {
    if (normalizedLayout === 'mix' && splitEnabled) {
      return buildMenuItems(appRoutes, { permissions }, { maxDepth: 1 });
    }
    return buildMenuItems(appRoutes, { permissions });
  }, [permissions, normalizedLayout, splitEnabled]);
  const sideMenuItems = useMemo(
    () =>
      buildMenuItems(splitSideRoutes, { permissions }, { menuType: settings.siderMenuType }),
    [permissions, splitSideRoutes, settings.siderMenuType],
  );
  const defaultOpenKeys = useMemo(
    () => getMenuOpenKeys(splitSideRoutes, { permissions }),
    [permissions, splitSideRoutes],
  );
  const menuEnabled = settings.menuRender !== false;
  const shouldShowSideMenu =
    menuEnabled && (normalizedLayout === 'side' || normalizedLayout === 'mix');
  const sideMenuItemsFinal =
    normalizedLayout === 'mix' && splitEnabled ? sideMenuItems : menuItems;
  const mainClassName = settings.fixedHeader
    ? 'app-main app-main-fixed'
    : 'app-main app-main-scroll';
  const contentClassName =
    layoutMode === 'topmenu' && settings.contentWidth === 'Fixed'
      ? 'app-content fixed'
      : 'app-content';

  useEffect(() => {
    syncWithRoute(location.pathname, location.search);
  }, [location.pathname, location.search, syncWithRoute]);

  const rootLayoutClass = useMemo(() => {
    if (normalizedLayout === 'side') {
      return 'sidemenu';
    }
    if (normalizedLayout === 'top') {
      return 'topmenu';
    }
    return 'mix';
  }, [normalizedLayout]);

  const showTopMenu =
    menuEnabled &&
    (normalizedLayout === 'top' || (normalizedLayout === 'mix' && splitEnabled));
  const showSiderLogo =
    settings.menuHeaderRender !== false && normalizedLayout === 'side';
  const showHeader = settings.headerRender !== false;
  const showFooter = settings.footerRender !== false;

  return (
    <>
      <Layout
        className={`app-root layout-${rootLayoutClass} ${showHeader ? '' : 'layout-no-header'} ${
          isDarkTheme ? 'theme-dark' : ''
        }`}
      >
        {layoutMode === 'sidemenu' ? (
          <>
            {shouldShowSideMenu && (
              <SideMenu
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme={effectiveTheme}
                width={settings.siderWidth}
                collapsedWidth={settings.collapsedWidth}
                fixed={settings.fixSiderbar}
                title={settings.title}
                logo={settings.logo}
                menuItems={sideMenuItemsFinal}
                defaultOpenAll={settings.menu.defaultOpenAll}
                defaultOpenKeys={defaultOpenKeys}
                showLogo={showSiderLogo}
              />
            )}
            <Layout className={mainClassName}>
              {showHeader && (
                <Header className={`app-header header-${headerTheme}`}>
                  <HeaderBar
                    layout={layoutMode}
                    title={settings.title}
                    logo={settings.logo}
                    menuItems={menuItems}
                    onMenuClick={(key) => navigate(key)}
                    navTheme={headerTheme}
                    showTopMenu={showTopMenu}
                  />
                </Header>
              )}
              {settings.multiTab && (
                <div className="app-tabs">
                  <TabsBar />
                </div>
              )}
              <Content className={contentClassName}>
                <div className="app-content-inner">
                  <Outlet />
                </div>
              </Content>
              {showFooter && <footer className="app-footer">© 2026 React Template</footer>}
            </Layout>
          </>
        ) : (
          <>
            {showHeader && (
              <Header className={`app-header header-${headerTheme}`}>
                <HeaderBar
                  layout={layoutMode}
                  title={settings.title}
                  logo={settings.logo}
                  menuItems={menuItems}
                  onMenuClick={(key) => navigate(key)}
                  navTheme={headerTheme}
                  showTopMenu={showTopMenu}
                />
              </Header>
            )}
            <Layout className="app-top-body">
              {shouldShowSideMenu && (
                <SideMenu
                  collapsed={collapsed}
                  onCollapse={setCollapsed}
                  theme={effectiveTheme}
                  width={settings.siderWidth}
                  collapsedWidth={settings.collapsedWidth}
                  fixed={settings.fixSiderbar}
                  title={settings.title}
                  logo={settings.logo}
                  menuItems={sideMenuItemsFinal}
                  defaultOpenAll={settings.menu.defaultOpenAll}
                  defaultOpenKeys={defaultOpenKeys}
                  showLogo={settings.menuHeaderRender !== false && normalizedLayout !== 'mix'}
                />
              )}
              <Layout className={mainClassName}>
                {settings.multiTab && (
                  <div className="app-tabs">
                    <TabsBar />
                  </div>
                )}
                <Content className={contentClassName}>
                  <div className="app-content-inner">
                    <Outlet />
                  </div>
                </Content>
                {showFooter && <footer className="app-footer">© 2026 React Template</footer>}
              </Layout>
            </Layout>
          </>
        )}
      </Layout>
      <SettingDrawer />
    </>
  );
}
