import { useRoutes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { createRouteObjects } from '@/router/generator';
import { routeEntries } from '@/router/routes';

const AppRoutes = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: createRouteObjects(routeEntries),
    },
  ]);

  return element;
};

export default function App() {
  return <AppRoutes />;
}
