import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// login option 3 routing
const FormCall = Loadable(lazy(() => import('views/pages/CallPages/FormCall/FormCallDocs')));
const TaxData = Loadable(lazy(() => import('views/pages/TaxData/TaxDatas')));
// const FormHire = Loadable(lazy(() => import('views/pages/Rol/rol')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/admin/usuarios',
      element: <FormCall />
    },
    {
      path: '/admin/asistencia',
      element: <FormCall />
    },
    {
      path: '/admin/justificacion',
      element: <FormCall />
    },
    {
      path: '/config/datos-de-la-empresa',
      element: <TaxData />
    },
    {
      path: '/config/crear-tienda',
      element: <FormCall />
    }
    // {
    //   path: '/users/hire',
    //   element: <FormHire />
    // }
  ]
};

export default AuthenticationRoutes;
