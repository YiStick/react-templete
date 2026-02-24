import { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { AliveScope } from 'react-activation';
import App from './app/App';
import { useAppStore } from './stores/appStore';
import { useLayoutStore } from './layouts/settingsStore';
import { resolveColorPrimary } from './layouts/themeUtils';
import './styles/global.less';

const Root = () => {
  const locale = useAppStore((state) => state.locale);
  const antdLocale = locale === 'en-US' ? enUS : zhCN;
  const { navTheme, colorPrimary } = useLayoutStore((state) => state.settings);
  const primaryColor = resolveColorPrimary(colorPrimary);
  const algorithm =
    navTheme === 'realDark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm;
  const themeSeed = useMemo(
    () => ({
      token: {
        colorPrimary: primaryColor,
        ...(navTheme === 'realDark' ? {} : { colorBgLayout: '#f0f2f5' }),
      },
      algorithm,
    }),
    [algorithm, navTheme, primaryColor],
  );
  const themeConfig = useMemo(
    () => ({
      ...themeSeed,
      cssVar: {
        prefix: 'ant',
      },
    }),
    [themeSeed],
  );

  useEffect(() => {
    const token = antdTheme.getDesignToken(themeSeed);
    const root = document.documentElement;
    root.style.setProperty('--app-primary-color', token.colorPrimary);
    root.style.setProperty('--app-layout-bg', token.colorBgLayout);
    root.style.setProperty('--app-header-bg', token.colorBgContainer);
    root.style.setProperty('--app-tabs-bg', token.colorBgContainer);
    root.style.setProperty('--app-border-color', token.colorBorderSecondary);
    root.style.setProperty('--app-text-color', token.colorText);
    root.style.setProperty('--app-text-secondary', token.colorTextSecondary);
    root.style.setProperty('--app-fill-alter', token.colorFillAlter);
  }, [themeSeed]);

  return (
    <ConfigProvider locale={antdLocale} theme={themeConfig}>
      <BrowserRouter>
        <AliveScope>
          <App />
        </AliveScope>
      </BrowserRouter>
    </ConfigProvider>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

createRoot(container).render(<Root />);
