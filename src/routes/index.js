<<<<<<< HEAD
// routes
=======
//ThemeRouter.js
>>>>>>> 4804d7f21c158ca5e79d411f40140c568df2e067
import { useRoutes } from 'react-router-dom';


import MainRoutes from './MainRoutes';
import HHRRRoutes from './UserRoutes';
import AdminRoutes from './AdminRouter';
import CuentaRoutes from './CuentaRouter';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([MainRoutes, AdminRoutes, HHRRRoutes, CuentaRoutes]);
}
