export type LayoutMode = 'sidemenu' | 'topmenu' | 'mix' | 'side' | 'top';
export type ContentWidth = 'Fluid' | 'Fixed';
export type NavTheme = 'dark' | 'light' | 'realDark';
export type SiderMenuType = 'sub' | 'group';

export type LayoutSettings = {
  title: string;
  logo?: string;
  navTheme: NavTheme;
  colorPrimary: string;
  siderMenuType: SiderMenuType;
  layout: LayoutMode;
  contentWidth: ContentWidth;
  fixedHeader: boolean;
  fixSiderbar: boolean;
  splitMenus: boolean;
  headerRender?: boolean;
  footerRender?: boolean;
  menuRender?: boolean;
  menuHeaderRender?: boolean;
  menu: {
    locale: boolean;
    defaultOpenAll: boolean;
    type: SiderMenuType;
  };
  pwa: boolean;
  iconfontUrl: string;
  siderWidth: number;
  collapsedWidth: number;
  multiTab: boolean;
};


export const layoutSettings: LayoutSettings = {
  title: 'React Template',
  logo: '',
  navTheme: 'light',
  colorPrimary: '#1677FF',
  siderMenuType: 'sub',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  splitMenus: false,
  menu: {
    locale: true,
    defaultOpenAll: false,
    type: 'sub',
  },
  pwa: false,
  footerRender: false,
  iconfontUrl: '',
  siderWidth: 208,
  collapsedWidth: 48,
  multiTab: true,
};
