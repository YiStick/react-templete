const themeColorMap: Record<string, string> = {
  techBlue: '#1677FF',
  daybreak: '#1890ff',
  dust: '#F5222D',
  volcano: '#FA541C',
  sunset: '#FAAD14',
  cyan: '#13C2C2',
  green: '#52C41A',
  geekblue: '#2F54EB',
  purple: '#722ED1',
};

export const genStringToTheme = (value?: string) =>
  value && themeColorMap[value] ? themeColorMap[value] : value;

export const resolveColorPrimary = (value?: string) =>
  genStringToTheme(value) || '#1677FF';

export const themeColors = Object.entries(themeColorMap).map(([key, color]) => ({
  key,
  color,
}));
