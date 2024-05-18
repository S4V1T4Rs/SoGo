import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MainLayout from 'layout/MainLayout';

// login option 3 routing
const IpDect = Loadable(lazy(() => import('components/IP/DetectorIp')));
const FormCall = Loadable(lazy(() => import('views/pages/CallPages/FormCall/FormCallDocs')));
const TaxData = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const PageDepartamento = Loadable(lazy(() => import('views/pages/Departamento/Formulario/FormDepartamento')));
const Xc = Loadable(lazy(() => import('views/pages/Rol/Formulario/FormRol')));
// const FormHire = Loadable(lazy(() => import('views/pages/Rol/rol')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AdminRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/admin/usuarios',
      element: <FormCall />
    },
    {
      path: '/admin/department',
      element: <PageDepartamento />
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
      path: '/admin/rolepermison',
      element: <Xc />
    },
    {
      path: '/config/datos-de-la-empresa',
      element: <TaxData />
    },
    {
      path: '/config/crear-tienda',
      element: <IpDect />
    }
    // {
    //   path: '/users/hire',
    //   element: <FormHire />
    // }
  ]
};

export default AdminRoutes;
