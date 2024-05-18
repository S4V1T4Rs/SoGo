import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// login option 3 routing
// const FormCall = Loadable(lazy(() => import('views/pages/CallPages/FormCall/FormCallDocs')));
const FormCandidatos = Loadable(lazy(() => import('views/pages/Candidatos/Formulario/FormCandidatos')));
//const FormVancancies = Loadable(lazy(() => import('views/pages/Vacantes/Formulario/FormVacantes')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const CuentaRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/candidate/notificaciones',
      element: <FormCandidatos />
    }
  ]
};

export default CuentaRoutes;
