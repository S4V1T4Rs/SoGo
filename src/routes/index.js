import { useRoutes } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import HHRRRoutes from './UserRoutes';
import AdminRoutes from './AdminRouter';
import CuentaRoutes from './CuentaRouter';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AdminRoutes, HHRRRoutes, CuentaRoutes]);
}
