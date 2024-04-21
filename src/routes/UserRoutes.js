import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// login option 3 routing
const FormCall = Loadable(lazy(() => import('views/pages/CallPages/FormCall/FormCallDocs')));
const FormHire = Loadable(lazy(() => import('views/pages/Rol/rol')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/users/call',
      element: <FormCall />
    },
    {
      path: '/users/hire',
      element: <FormHire />
    }
  ]
};

export default AuthenticationRoutes;
