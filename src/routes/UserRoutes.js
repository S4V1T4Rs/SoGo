import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// login option 3 routing
// const FormCall = Loadable(lazy(() => import('views/pages/CallPages/FormCall/FormCallDocs')));
const FormCandidatos = Loadable(lazy(() => import('views/pages/Candidatos/Formulario/FormCandidatos')));
const FormVancancies = Loadable(lazy(() => import('views/pages/Vacantes/Formulario/FormVacantes')));
const FormMensaje = Loadable(lazy(() => import('views/pages/Mensajes/Formulario/FormMensajes')));
// ==============================|| AUTHENTICATION ROUTING ||============================== //

const HHRRRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/rrhh/candidate',
      element: <FormCandidatos />
    },
    {
      path: '/rrhh/vacancies',
      element: <FormVancancies />
    },
    {
      path: '/rrhh/mensajes',
      element: <FormMensaje />
    }
  ]
};

export default HHRRRoutes;
