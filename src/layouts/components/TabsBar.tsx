import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { WheelEvent } from 'react';
import { Button, Dropdown, Tabs } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAliveController } from 'react-activation';
import { useTabsStore } from '@/stores/tabsStore';
import type { TabItem } from '@/stores/tabsStore';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const getTranslateX = (element: HTMLElement) => {
  const transform = window.getComputedStyle(element).transform;
  if (!transform || transform === 'none') {
    return 0;
  }
  const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);
  if (matrix3dMatch) {
    const values = matrix3dMatch[1].split(',').map((item) => Number(item.trim()));
    return values[12] || 0;
  }
  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
  if (matrixMatch) {
    const values = matrixMatch[1].split(',').map((item) => Number(item.trim()));
    return values[4] || 0;
  }
  const translateMatch = transform.match(/translateX?\(([-\d.]+)px\)/);
  if (translateMatch) {
    return Number(translateMatch[1]);
  }
  return 0;
};

export default function TabsBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { drop } = useAliveController();
  const tabs = useTabsStore((state) => state.tabs);
  const activeKey = useTabsStore((state) => state.activeKey);
  const closeTab = useTabsStore((state) => state.closeTab);
  const closeLeft = useTabsStore((state) => state.closeLeft);
  const closeRight = useTabsStore((state) => state.closeRight);
  const closeOthers = useTabsStore((state) => state.closeOthers);
  const closeAll = useTabsStore((state) => state.closeAll);
  const currentFullPath = `${location.pathname}${location.search}`;
  const tabsRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    canScroll: false,
    atStart: true,
    atEnd: true,
  });

  const prevTabsRef = useRef(tabs);

  useEffect(() => {
    const prevTabs = prevTabsRef.current;
    const removed = prevTabs.filter((tab) => !tabs.some((current) => current.key === tab.key));
    removed.forEach((tab) => drop(tab.key));
    prevTabsRef.current = tabs;
  }, [tabs, drop]);

  const handleTabAction = useCallback(
    (action: string, tabKey: string) => {
      let nextKey: string | undefined;
      if (action === 'close') {
        nextKey = closeTab(tabKey);
      } else if (action === 'close-left') {
        nextKey = closeLeft(tabKey);
      } else if (action === 'close-right') {
        nextKey = closeRight(tabKey);
      } else if (action === 'close-others') {
        nextKey = closeOthers(tabKey);
      } else if (action === 'close-all') {
        nextKey = closeAll();
      }
      if (nextKey && nextKey !== currentFullPath) {
        navigate(nextKey);
      }
    },
    [closeAll, closeLeft, closeOthers, closeRight, closeTab, currentFullPath, navigate],
  );

  const buildContextMenu = useCallback(
    (tab: TabItem): MenuProps['items'] => {
      const index = tabs.findIndex((item) => item.key === tab.key);
      const leftClosable = tabs.slice(0, index).some((item) => item.closable);
      const rightClosable = tabs.slice(index + 1).some((item) => item.closable);
      const otherClosable = tabs.some((item) => item.key !== tab.key && item.closable);
      const closableCount = tabs.filter((item) => item.closable).length;
      const onlyOne = tabs.length <= 1;
      return [
        { key: 'close', label: '关闭当前', disabled: !tab.closable || onlyOne },
        { key: 'close-left', label: '关闭左侧', disabled: !leftClosable },
        { key: 'close-right', label: '关闭右侧', disabled: !rightClosable },
        { key: 'close-others', label: '关闭其他', disabled: !otherClosable },
        { key: 'close-all', label: '关闭全部', disabled: closableCount === 0 || onlyOne },
      ];
    },
    [tabs],
  );

  const items = useMemo(
    () =>
      tabs.map((tab) => ({
        key: tab.key,
        label: (
          <Dropdown
            trigger={['contextMenu']}
            menu={{
              items: buildContextMenu(tab),
              onClick: ({ key }) => handleTabAction(key, tab.key),
            }}
          >
            <span className="tabs-bar-label">{tab.title}</span>
          </Dropdown>
        ),
        closable: tabs.length > 1 && tab.closable,
      })),
    [tabs, buildContextMenu, handleTabAction],
  );

  const updateScrollState = useCallback(() => {
    const container = tabsRef.current;
    if (!container) {
      return;
    }
    const navWrap = container.querySelector<HTMLDivElement>('.ant-tabs-nav-wrap');
    const navList = container.querySelector<HTMLDivElement>('.ant-tabs-nav-list');
    if (!navWrap || !navList) {
      return;
    }
    const maxTranslate = Math.max(0, navList.scrollWidth - navWrap.clientWidth);
    if (maxTranslate <= 0) {
      navList.style.transform = 'translate(0px, 0px)';
      setScrollState({ canScroll: false, atStart: true, atEnd: true });
      return;
    }
    const current = getTranslateX(navList);
    const atStart = current >= 0;
    const atEnd = current <= -maxTranslate;
    setScrollState({ canScroll: true, atStart, atEnd });
  }, []);

  const applyTranslate = useCallback(
    (navList: HTMLDivElement, navWrap: HTMLDivElement, next: number) => {
      const maxTranslate = Math.max(0, navList.scrollWidth - navWrap.clientWidth);
      if (maxTranslate <= 0) {
        navList.style.transform = 'translate(0px, 0px)';
        setScrollState({ canScroll: false, atStart: true, atEnd: true });
        return;
      }
      const clamped = Math.min(0, Math.max(-maxTranslate, next));
      navList.style.transform = `translate(${clamped}px, 0px)`;
      const atStart = clamped >= 0;
      const atEnd = clamped <= -maxTranslate;
      setScrollState({ canScroll: true, atStart, atEnd });
    },
    [],
  );

  const handleWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      const container = tabsRef.current;
      if (!container) {
        return;
      }
      const navWrap = container.querySelector<HTMLDivElement>('.ant-tabs-nav-wrap');
      const navList = container.querySelector<HTMLDivElement>('.ant-tabs-nav-list');
      if (!navWrap || !navList) {
        return;
      }
      const maxTranslate = Math.max(0, navList.scrollWidth - navWrap.clientWidth);
      if (maxTranslate <= 0) {
        return;
      }
      event.preventDefault();
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const current = getTranslateX(navList);
      applyTranslate(navList, navWrap, current - delta);
    },
    [applyTranslate],
  );

  const scrollByOffset = useCallback((offset: number) => {
    const container = tabsRef.current;
    if (!container) {
      return;
    }
    const navWrap = container.querySelector<HTMLDivElement>('.ant-tabs-nav-wrap');
    const navList = container.querySelector<HTMLDivElement>('.ant-tabs-nav-list');
    if (!navWrap || !navList) {
      return;
    }
    const maxTranslate = Math.max(0, navList.scrollWidth - navWrap.clientWidth);
    if (maxTranslate <= 0) {
      return;
    }
    const current = getTranslateX(navList);
    applyTranslate(navList, navWrap, current + offset);
  }, [applyTranslate]);

  const handleScrollLeft = useCallback(() => {
    scrollByOffset(200);
  }, [scrollByOffset]);

  const handleScrollRight = useCallback(() => {
    scrollByOffset(-200);
  }, [scrollByOffset]);

  const scrollActiveIntoView = useCallback(() => {
    const container = tabsRef.current;
    if (!container) {
      return;
    }
    const navWrap = container.querySelector<HTMLDivElement>('.ant-tabs-nav-wrap');
    const navList = container.querySelector<HTMLDivElement>('.ant-tabs-nav-list');
    if (!navWrap || !navList) {
      return;
    }
    const maxTranslate = Math.max(0, navList.scrollWidth - navWrap.clientWidth);
    if (maxTranslate <= 0) {
      applyTranslate(navList, navWrap, 0);
      return;
    }
    const tabNodes = Array.from(navList.querySelectorAll<HTMLElement>('.ant-tabs-tab'));
    const activeTab = tabNodes.find(
      (node) => node.getAttribute('data-node-key') === activeKey,
    );
    if (!activeTab) {
      return;
    }
    const current = getTranslateX(navList);
    const activeLeft = activeTab.offsetLeft + current;
    const activeRight = activeLeft + activeTab.offsetWidth;
    let next = current;
    if (activeLeft < 0) {
      next = current - activeLeft;
    } else if (activeRight > navWrap.clientWidth) {
      next = current - (activeRight - navWrap.clientWidth);
    }
    next = Math.min(0, Math.max(-maxTranslate, next));
    applyTranslate(navList, navWrap, next);
  }, [activeKey, applyTranslate]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(scrollActiveIntoView);
    return () => window.cancelAnimationFrame(frame);
  }, [activeKey, tabs.length, scrollActiveIntoView]);

  useEffect(() => {
    const handleResize = () => {
      scrollActiveIntoView();
      updateScrollState();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollActiveIntoView, updateScrollState]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateScrollState);
    return () => window.cancelAnimationFrame(frame);
  }, [tabs.length, updateScrollState]);

  return (
    <div className="tabs-bar" ref={tabsRef} onWheel={handleWheel}>
      <Tabs
        type="editable-card"
        hideAdd
        size="small"
        tabBarGutter={4}
        animated={false}
        activeKey={activeKey}
        items={items}
        onChange={(key) => navigate(key)}
        onEdit={(targetKey, action) => {
          if (action !== 'remove') {
            return;
          }
          const nextKey = closeTab(targetKey as string);
          if (nextKey && nextKey !== currentFullPath) {
            navigate(nextKey);
          }
        }}
      />
      <div className="tabs-bar-arrows">
        <Button
          size="small"
          icon={<LeftOutlined />}
          onClick={handleScrollLeft}
          disabled={!scrollState.canScroll || scrollState.atStart}
        />
        <Button
          size="small"
          icon={<RightOutlined />}
          onClick={handleScrollRight}
          disabled={!scrollState.canScroll || scrollState.atEnd}
        />
      </div>
    </div>
  );
}
