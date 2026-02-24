import type { ReactElement, ReactNode } from 'react';
import { cloneElement, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Divider,
  Drawer,
  List,
  Select,
  Switch,
  Tooltip,
  message,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  NotificationOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { LayoutMode, LayoutSettings, NavTheme, SiderMenuType } from '@/layouts/layoutConfig';
import { useLayoutStore } from '@/layouts/settingsStore';
import { useAppStore } from '@/stores/appStore';
import { resolveColorPrimary, themeColors } from '@/layouts/themeUtils';
import './settingDrawer.less';

type LocaleKey = 'zh-CN' | 'en-US';

const localeMessages: Record<LocaleKey, Record<string, string>> = {
  'zh-CN': {
    'app.setting.pagestyle': '整体风格设置',
    'app.setting.pagestyle.dark': '暗色菜单风格',
    'app.setting.pagestyle.light': '亮色菜单风格',
    'app.setting.pagestyle.realdark': '暗色风格(实验功能)',
    'app.setting.content-width': '内容区域宽度',
    'app.setting.content-width.fixed': '定宽',
    'app.setting.content-width.fluid': '流式',
    'app.setting.themecolor': '主题色',
    'app.setting.themecolor.dust': '薄暮',
    'app.setting.themecolor.volcano': '火山',
    'app.setting.themecolor.sunset': '日暮',
    'app.setting.themecolor.cyan': '明青',
    'app.setting.themecolor.green': '极光绿',
    'app.setting.themecolor.techBlue': '科技蓝（默认）',
    'app.setting.themecolor.daybreak': '拂晓',
    'app.setting.themecolor.geekblue': '极客蓝',
    'app.setting.themecolor.purple': '酱紫',
    'app.setting.navigationmode': '导航模式',
    'app.setting.sidermenutype': '侧边菜单类型',
    'app.setting.sidermenutype-sub': '经典模式',
    'app.setting.sidermenutype-group': '分组模式',
    'app.setting.regionalsettings': '内容区域',
    'app.setting.regionalsettings.header': '顶栏',
    'app.setting.regionalsettings.menu': '菜单',
    'app.setting.regionalsettings.footer': '页脚',
    'app.setting.regionalsettings.menuHeader': '菜单头',
    'app.setting.sidemenu': '侧边菜单布局',
    'app.setting.topmenu': '顶部菜单布局',
    'app.setting.mixmenu': '混合菜单布局',
    'app.setting.splitMenus': '自动分割菜单',
    'app.setting.fixedheader': '固定 Header',
    'app.setting.fixedsidebar': '固定侧边菜单',
    'app.setting.fixedsidebar.hint': '侧边菜单布局时可配置',
    'app.setting.othersettings': '其他设置',
    'app.setting.copy': '拷贝设置',
    'app.setting.copyinfo': '拷贝成功，请到 src/layouts/layoutConfig.ts 中替换默认配置',
    'app.setting.production.hint': '配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改配置文件',
    'app.setting.multitab': '多标签栏',
  },
  'en-US': {
    'app.setting.pagestyle': 'Page style setting',
    'app.setting.pagestyle.dark': 'Dark Menu style',
    'app.setting.pagestyle.light': 'Light Menu style',
    'app.setting.pagestyle.realdark': 'Dark style (Beta)',
    'app.setting.content-width': 'Content Width',
    'app.setting.content-width.fixed': 'Fixed',
    'app.setting.content-width.fluid': 'Fluid',
    'app.setting.themecolor': 'Theme Color',
    'app.setting.themecolor.dust': 'Dust Red',
    'app.setting.themecolor.volcano': 'Volcano',
    'app.setting.themecolor.sunset': 'Sunset Orange',
    'app.setting.themecolor.cyan': 'Cyan',
    'app.setting.themecolor.green': 'Polar Green',
    'app.setting.themecolor.techBlue': 'Tech Blue (default)',
    'app.setting.themecolor.daybreak': 'Daybreak Blue',
    'app.setting.themecolor.geekblue': 'Geek Blue',
    'app.setting.themecolor.purple': 'Golden Purple',
    'app.setting.sidermenutype': 'SideMenu Type',
    'app.setting.sidermenutype-sub': 'Classic',
    'app.setting.sidermenutype-group': 'Grouping',
    'app.setting.navigationmode': 'Navigation Mode',
    'app.setting.regionalsettings': 'Regional Settings',
    'app.setting.regionalsettings.header': 'Header',
    'app.setting.regionalsettings.menu': 'Menu',
    'app.setting.regionalsettings.footer': 'Footer',
    'app.setting.regionalsettings.menuHeader': 'Menu Header',
    'app.setting.sidemenu': 'Side Menu Layout',
    'app.setting.topmenu': 'Top Menu Layout',
    'app.setting.mixmenu': 'Mix Menu Layout',
    'app.setting.splitMenus': 'Split Menus',
    'app.setting.fixedheader': 'Fixed Header',
    'app.setting.fixedsidebar': 'Fixed Sidebar',
    'app.setting.fixedsidebar.hint': 'Works on Side Menu Layout',
    'app.setting.othersettings': 'Other Settings',
    'app.setting.copy': 'Copy Setting',
    'app.setting.copyinfo': 'Copy success, please replace default settings in layoutConfig.ts',
    'app.setting.production.hint': 'Setting panel shows in development environment only, please manually modify',
    'app.setting.multitab': 'Multi Tabs',
  },
};

const metaEnv = (import.meta as { env?: { MODE?: string; DEV?: boolean } }).env;
const isDev =
  (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') ||
  metaEnv?.DEV === true ||
  metaEnv?.MODE === 'development';

type BlockCheckboxItem = {
  key: string;
  title: string;
  icon?: ReactNode;
};

type BlockCheckboxProps = {
  value?: string;
  configType: string;
  list: BlockCheckboxItem[];
  prefixCls: string;
  onChange: (value: string) => void;
};

const BlockCheckbox = ({ value, configType, list, prefixCls, onChange }: BlockCheckboxProps) => {
  const baseClassName = `${prefixCls}-block-checkbox`;
  return (
    <div className={baseClassName} style={{ minHeight: 42 }}>
      {list.map((item) => (
        <Tooltip title={item.title} key={item.key}>
          <div
            className={[
              `${baseClassName}-item`,
              `${baseClassName}-item-${item.key}`,
              `${baseClassName}-${configType}-item`,
            ].join(' ')}
            onClick={() => onChange(item.key)}
          >
            <CheckOutlined
              className={`${baseClassName}-selectIcon`}
              style={{ display: value === item.key ? 'block' : 'none' }}
            />
            {item.icon ? <div className={`${baseClassName}-icon`}>{item.icon}</div> : null}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

type ThemeColorProps = {
  value?: string;
  prefixCls: string;
  formatMessage: (id: string) => string;
  onChange: (color: string) => void;
};

const ThemeColor = ({ value, prefixCls, formatMessage, onChange }: ThemeColorProps) => {
  const baseClassName = `${prefixCls}-theme-color`;
  if (!themeColors.length) {
    return null;
  }
  return (
    <div className={baseClassName}>
      {themeColors.map(({ key, color }) => (
        <Tooltip
          key={color}
          title={formatMessage(`app.setting.themecolor.${key}`)}
        >
          <div
            className={`${baseClassName}-block`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          >
            {value === color ? <CheckOutlined /> : null}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

type LayoutSettingItem = {
  title: string;
  action: ReactElement;
  disabled?: boolean;
  disabledReason?: string;
};

const renderLayoutSettingItem = (item: LayoutSettingItem) => {
  const action = cloneElement(item.action, {
    disabled: item.disabled,
  });
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <List.Item actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </List.Item>
    </Tooltip>
  );
};

const normalizeLayout = (layout?: LayoutMode) => {
  if (layout === 'sidemenu') {
    return 'side';
  }
  if (layout === 'topmenu') {
    return 'top';
  }
  return layout ?? 'side';
};

const LayoutSetting = ({
  settings,
  prefixCls,
  formatMessage,
  changeSetting,
}: {
  settings: LayoutSettings;
  prefixCls: string;
  formatMessage: (id: string) => string;
  changeSetting: <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => void;
}) => {
  const layout = normalizeLayout(settings.layout);
  return (
    <List
      className={`${prefixCls}-list`}
      split={false}
      dataSource={[
        {
          title: formatMessage('app.setting.content-width'),
          action: (
            <Select
              value={settings.contentWidth || 'Fixed'}
              size="small"
              className="content-width"
              onSelect={(value) => changeSetting('contentWidth', value as LayoutSettings['contentWidth'])}
              style={{ width: 80 }}
            >
              {layout === 'side' ? null : (
                <Select.Option value="Fixed">
                  {formatMessage('app.setting.content-width.fixed')}
                </Select.Option>
              )}
              <Select.Option value="Fluid">
                {formatMessage('app.setting.content-width.fluid')}
              </Select.Option>
            </Select>
          ),
        },
        {
          title: formatMessage('app.setting.fixedheader'),
          action: (
            <Switch
              size="small"
              className="fixed-header"
              checked={!!settings.fixedHeader}
              onChange={(checked) => changeSetting('fixedHeader', checked)}
            />
          ),
        },
        {
          title: formatMessage('app.setting.fixedsidebar'),
          disabled: layout === 'top',
          disabledReason: formatMessage('app.setting.fixedsidebar.hint'),
          action: (
            <Switch
              size="small"
              className="fix-siderbar"
              checked={!!settings.fixSiderbar}
              onChange={(checked) => changeSetting('fixSiderbar', checked)}
            />
          ),
        },
        {
          title: formatMessage('app.setting.splitMenus'),
          disabled: layout !== 'mix',
          action: (
            <Switch
              size="small"
              checked={!!settings.splitMenus}
              className="split-menus"
              onChange={(checked) => changeSetting('splitMenus', checked)}
            />
          ),
        },
      ]}
      renderItem={renderLayoutSettingItem}
    />
  );
};

const RegionalSetting = ({
  settings,
  prefixCls,
  formatMessage,
  changeSetting,
}: {
  settings: LayoutSettings;
  prefixCls: string;
  formatMessage: (id: string) => string;
  changeSetting: <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => void;
}) => {
  const regionalSetting = ['header', 'footer', 'menu', 'menuHeader'] as const;
  return (
    <List
      className={`${prefixCls}-list`}
      split={false}
      renderItem={renderLayoutSettingItem}
      dataSource={regionalSetting.map((key) => ({
        title: formatMessage(`app.setting.regionalsettings.${key}`),
        action: (
          <Switch
            size="small"
            className={`regional-${key}`}
            checked={settings[`${key}Render` as keyof LayoutSettings] !== false}
            onChange={(checked) =>
              changeSetting(
                `${key}Render` as keyof LayoutSettings,
                checked === true ? undefined : false,
              )
            }
          />
        ),
      }))}
    />
  );
};

const Body = ({
  title,
  prefixCls,
  children,
}: {
  title: string;
  prefixCls: string;
  children: ReactNode;
}) => (
  <div style={{ marginBottom: 12 }}>
    <h3 className={`${prefixCls}-body-title`}>{title}</h3>
    {children}
  </div>
);

const genCopySettingJson = (settings: LayoutSettings) => {
  const copySettings = {
    navTheme: settings.navTheme,
    colorPrimary: settings.colorPrimary,
    layout: settings.layout,
    contentWidth: settings.contentWidth,
    fixedHeader: settings.fixedHeader,
    fixSiderbar: settings.fixSiderbar,
    splitMenus: settings.splitMenus,
    siderMenuType: settings.siderMenuType,
    headerRender: settings.headerRender,
    footerRender: settings.footerRender,
    menuRender: settings.menuRender,
    menuHeaderRender: settings.menuHeaderRender,
    multiTab: settings.multiTab,
  };
  return JSON.stringify(copySettings, null, 2);
};

const SubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    viewBox="0 0 104 104"
  >
    <defs>
      <rect id="sub-path-1" width="90" height="72" x="0" y="0" rx="10" />
      <filter
        id="sub-filter-2"
        width="152.2%"
        height="165.3%"
        x="-26.1%"
        y="-27.1%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology in="SourceAlpha" radius="0.25" result="shadowSpreadOuter1" />
        <feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1" />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
        />
        <feMorphology in="SourceAlpha" radius="1" result="shadowSpreadOuter2" />
        <feOffset dy="2" in="shadowSpreadOuter2" result="shadowOffsetOuter2" />
        <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="4" />
        <feColorMatrix
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
          values="0 0 0 0 0.098466735 0 0 0 0 0.0599695403 0 0 0 0 0.0599695403 0 0 0 0.07 0"
        />
        <feMorphology in="SourceAlpha" radius="2" result="shadowSpreadOuter3" />
        <feOffset dy="4" in="shadowSpreadOuter3" result="shadowOffsetOuter3" />
        <feGaussianBlur in="shadowOffsetOuter3" result="shadowBlurOuter3" stdDeviation="8" />
        <feColorMatrix
          in="shadowBlurOuter3"
          result="shadowMatrixOuter3"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
          <feMergeNode in="shadowMatrixOuter3" />
        </feMerge>
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <g>
        <use fill="#000" filter="url(#sub-filter-2)" xlinkHref="#sub-path-1" />
        <use fill="#F0F2F5" xlinkHref="#sub-path-1" />
      </g>
      <path fill="#FFF" d="M26 0h55c5.523 0 10 4.477 10 10v8H26V0z" />
      <path
        fill="#00182e"
        d="M10 0h19v72H10C4.477 72 0 67.523 0 62V10C0 4.477 4.477 0 10 0z"
      />
      <rect width="14" height="3" x="5" y="18" fill="#D7DDE6" opacity="0.2" rx="1.5" />
      <rect width="14" height="3" x="5" y="42" fill="#D7DDE6" opacity="0.2" rx="1.5" />
      <rect width="9" height="3" x="5" y="24" fill="#D7DDE6" opacity="0.2" rx="1.5" />
      <rect width="9" height="3" x="5" y="48" fill="#D7DDE6" opacity="0.2" rx="1.5" />
      <rect width="9" height="3" x="5" y="54" fill="#D7DDE6" opacity="0.2" rx="1.5" />
      <rect width="44" height="3" x="38" y="18" fill="#D7DDE6" rx="1.5" />
      <rect width="44" height="3" x="38" y="42" fill="#D7DDE6" rx="1.5" />
      <rect width="28" height="3" x="38" y="24" fill="#D7DDE6" rx="1.5" />
      <rect width="28" height="3" x="38" y="48" fill="#D7DDE6" rx="1.5" />
      <rect width="28" height="3" x="38" y="54" fill="#D7DDE6" rx="1.5" />
    </g>
  </svg>
);

const GroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="1em"
    height="1em"
    viewBox="0 0 104 104"
  >
    <defs>
      <rect id="group-path-1" width="90" height="72" x="0" y="0" rx="10" />
      <filter
        id="group-filter-2"
        width="152.2%"
        height="165.3%"
        x="-26.1%"
        y="-27.1%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology in="SourceAlpha" radius="0.25" result="shadowSpreadOuter1" />
        <feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="1" />
        <feColorMatrix
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
        />
        <feMorphology in="SourceAlpha" radius="1" result="shadowSpreadOuter2" />
        <feOffset dy="2" in="shadowSpreadOuter2" result="shadowOffsetOuter2" />
        <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation="4" />
        <feColorMatrix
          in="shadowBlurOuter2"
          result="shadowMatrixOuter2"
          values="0 0 0 0 0.098466735 0 0 0 0 0.0599695403 0 0 0 0 0.0599695403 0 0 0 0.07 0"
        />
        <feMorphology in="SourceAlpha" radius="2" result="shadowSpreadOuter3" />
        <feOffset dy="4" in="shadowSpreadOuter3" result="shadowOffsetOuter3" />
        <feGaussianBlur in="shadowOffsetOuter3" result="shadowBlurOuter3" stdDeviation="8" />
        <feColorMatrix
          in="shadowBlurOuter3"
          result="shadowMatrixOuter3"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
        />
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1" />
          <feMergeNode in="shadowMatrixOuter2" />
          <feMergeNode in="shadowMatrixOuter3" />
        </feMerge>
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
      <g>
        <use fill="#000" filter="url(#group-filter-2)" xlinkHref="#group-path-1" />
        <use fill="#F0F2F5" xlinkHref="#group-path-1" />
      </g>
      <path fill="#FFF" d="M25 15h65v47c0 5.523-4.477 10-10 10H25V15z" />
      <path stroke="#E6EAF0" strokeLinecap="square" d="M0.5 15.5L90.5 15.5" />
      <rect width="14" height="3" x="4" y="26" fill="#D7DDE6" rx="1.5" />
      <rect width="9" height="3" x="4" y="32" fill="#D7DDE6" rx="1.5" />
      <rect width="9" height="3" x="4" y="44" fill="#D7DDE6" rx="1.5" />
      <rect width="14" height="3" x="4" y="50" fill="#D7DDE6" rx="1.5" />
      <rect width="14" height="3" x="4" y="56" fill="#D7DDE6" rx="1.5" />
      <rect width="44" height="3" x="38" y="26" fill="#D7DDE6" rx="1.5" />
      <rect width="44" height="3" x="38" y="50" fill="#D7DDE6" rx="1.5" />
      <rect width="28" height="3" x="38" y="32" fill="#D7DDE6" rx="1.5" />
      <rect width="28" height="3" x="38" y="56" fill="#D7DDE6" rx="1.5" />
    </g>
  </svg>
);

export default function SettingDrawer() {
  const [open, setOpen] = useState(false);
  const locale = useAppStore((state) => state.locale);
  const settings = useLayoutStore((state) => state.settings);
  const setSettings = useLayoutStore((state) => state.setSettings);
  const formatMessage = useMemo(() => {
    const lang = localeMessages[locale as LocaleKey] ?? localeMessages['zh-CN'];
    return (id: string) => lang[id] ?? id;
  }, [locale]);

  const layoutValue = normalizeLayout(settings.layout);
  const themeValue: NavTheme =
    settings.navTheme === 'dark' ? 'realDark' : settings.navTheme;

  if (!isDev) {
    return null;
  }

  const changeSetting = <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    const nextPatch: Partial<LayoutSettings> = { [key]: value };
    if (key === 'layout') {
      const nextLayout = normalizeLayout(value as LayoutMode);
      nextPatch.contentWidth = nextLayout === 'top' ? 'Fixed' : 'Fluid';
      if (nextLayout !== 'mix') {
        nextPatch.splitMenus = false;
      }
      if (nextLayout === 'mix') {
        nextPatch.navTheme = 'light';
      }
    }
    if (key === 'siderMenuType') {
      nextPatch.menu = { type: value as SiderMenuType };
    }
    if (key === 'colorPrimary') {
      nextPatch.colorPrimary = resolveColorPrimary(value as string);
    }
    setSettings(nextPatch);
  };

  return (
    <>
      <div className="app-setting-drawer-handle" onClick={() => setOpen(!open)}>
        {open ? <CloseOutlined style={{ color: '#fff', fontSize: 20 }} /> : <SettingOutlined style={{ color: '#fff', fontSize: 20 }} />}
      </div>
      <Drawer
        open={open}
        width={300}
        onClose={() => setOpen(false)}
        closable={false}
        placement="right"
        style={{ zIndex: 999 }}
      >
        <div className="app-setting-drawer-content">
          <Body title={formatMessage('app.setting.pagestyle')} prefixCls="app-setting-drawer">
            <BlockCheckbox
              prefixCls="app-setting-drawer"
              list={[
                {
                  key: 'light',
                  title: formatMessage('app.setting.pagestyle.light'),
                },
                {
                  key: 'realDark',
                  title: formatMessage('app.setting.pagestyle.realdark'),
                },
              ]}
              value={themeValue}
              configType="theme"
              onChange={(value) => changeSetting('navTheme', value as NavTheme)}
            />
          </Body>
          <Body title={formatMessage('app.setting.themecolor')} prefixCls="app-setting-drawer">
            <ThemeColor
              prefixCls="app-setting-drawer"
              value={resolveColorPrimary(settings.colorPrimary)}
              formatMessage={formatMessage}
              onChange={(color) => changeSetting('colorPrimary', color)}
            />
          </Body>
          <Divider />
          <Body title={formatMessage('app.setting.navigationmode')} prefixCls="app-setting-drawer">
            <BlockCheckbox
              prefixCls="app-setting-drawer"
              value={layoutValue}
              configType="layout"
              list={[
                { key: 'side', title: formatMessage('app.setting.sidemenu') },
                { key: 'top', title: formatMessage('app.setting.topmenu') },
                { key: 'mix', title: formatMessage('app.setting.mixmenu') },
              ]}
              onChange={(value) => changeSetting('layout', value as LayoutMode)}
            />
          </Body>
          {layoutValue === 'side' || layoutValue === 'mix' ? (
            <Body title={formatMessage('app.setting.sidermenutype')} prefixCls="app-setting-drawer">
              <BlockCheckbox
                prefixCls="app-setting-drawer"
                value={settings.siderMenuType}
                configType="siderMenuType"
                list={[
                  {
                    key: 'sub',
                    icon: <SubIcon />,
                    title: formatMessage('app.setting.sidermenutype-sub'),
                  },
                  {
                    key: 'group',
                    icon: <GroupIcon />,
                    title: formatMessage('app.setting.sidermenutype-group'),
                  },
                ]}
                onChange={(value) => changeSetting('siderMenuType', value as SiderMenuType)}
              />
            </Body>
          ) : null}
          <LayoutSetting
            settings={settings}
            prefixCls="app-setting-drawer"
            formatMessage={formatMessage}
            changeSetting={changeSetting}
          />
          <Divider />
          <Body title={formatMessage('app.setting.regionalsettings')} prefixCls="app-setting-drawer">
            <RegionalSetting
              settings={settings}
              prefixCls="app-setting-drawer"
              formatMessage={formatMessage}
              changeSetting={changeSetting}
            />
          </Body>
          <Divider />
          <Body title={formatMessage('app.setting.othersettings')} prefixCls="app-setting-drawer">
            <List
              className="app-setting-drawer-list"
              split={false}
              size="small"
              renderItem={renderLayoutSettingItem}
              dataSource={[
                {
                  title: formatMessage('app.setting.multitab'),
                  action: (
                    <Switch
                      size="small"
                      checked={!!settings.multiTab}
                      onChange={(checked) => changeSetting('multiTab', checked)}
                    />
                  ),
                },
              ]}
            />
          </Body>
          <Divider />
          <Alert
            type="warning"
            message={formatMessage('app.setting.production.hint')}
            icon={<NotificationOutlined />}
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Button
            block
            icon={<CopyOutlined />}
            style={{ marginBottom: 24 }}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(genCopySettingJson(settings));
                message.success(formatMessage('app.setting.copyinfo'));
              } catch (error) {
                // ignore
              }
            }}
          >
            {formatMessage('app.setting.copy')}
          </Button>
        </div>
      </Drawer>
    </>
  );
}
