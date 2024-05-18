// assets
import { IconUsers, IconKey, IconHierarchy, IconReport, IconSettings } from '@tabler/icons-react'; // Asumiendo que IconUsers representa un icono de usuarios y IconBuilding representa un icono de departamento.

// constant
const icons = {
  IconKey,
  IconUsers,
  IconHierarchy,
  IconReport,
  IconSettings
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const admin = {
  id: 'admins',
  title: 'Gestion Administrador',
  caption: 'supervisa usuarios y configuraciones',
  type: 'group',
  children: [
    {
      id: 'user',
      title: 'Usuarios',
      type: 'item',
      url: '/admin/usuarios',
      icon: icons.IconUsers

      // children: [
      //   {
      //     id: 'xd',
      //     title: 'registros',
      //     type: 'item',
      //     url: '/admin/xd',
      //     target: false
      //   }
      //   // {
      //   //   id: 'hire',
      //   //   title: 'Contratar',
      //   //   type: 'item',
      //   //   url: '/users/hire',
      //   //   target: false
      //   // }
      // ]
    },
    {
      id: 'depa',
      title: 'Departamento',
      type: 'item',
      url: '/admin/department',
      icon: icons.IconHierarchy
    },
    {
      id: 'rope',
      title: 'Roles y Permisos',
      type: 'item',
      url: '/admin/rolepermison',
      icon: icons.IconKey
    },
    {
      id: 'admin',
      title: 'Informe Empleado',
      type: 'collapse',
      icon: icons.IconReport,

      children: [
        {
          id: 'asistencia',
          title: 'asistencia',
          type: 'item',
          url: '/admin/asistencia',
          target: false
        },
        {
          id: 'justificacion',
          title: 'justificacion',
          type: 'item',
          url: '/admin/justificacion',
          target: false
        }
        // {
        //   id: 'hire',
        //   title: 'Contratar',
        //   type: 'item',
        //   url: '/users/hire',
        //   target: false
        // }
      ]
    },
    {
      id: 'config',
      title: 'Configuracion',
      type: 'collapse',
      icon: icons.IconSettings,

      children: [
        {
          id: 'datos-de-la-empresa',
          title: 'Datos de la Empresa',
          type: 'item',
          url: '/config/datos-de-la-empresa',
          target: false
        },
        {
          id: 'crear-tienda',
          title: 'Crear Tienda',
          type: 'item',
          url: '/config/crear-tienda',
          target: false
        }
        // {
        //   id: 'hire',
        //   title: 'Contratar',
        //   type: 'item',
        //   url: '/users/hire',
        //   target: false
        // }
      ]
    }
    // {
    //   id: 'admin',
    //   title: 'Departamento',
    //   type: 'collapse',
    //   icon: icons.IconKey,

    //   children: [
    //     {
    //       id: 'xd',
    //       title: 'Convocatoria',
    //       type: 'item',
    //       url: '/admin/xds',
    //       target: false
    //     }
    //     // {
    //     //   id: 'hire',
    //     //   title: 'Contratar',
    //     //   type: 'item',
    //     //   url: '/users/hire',
    //     //   target: false
    //     // }
    //   ]
    // }
  ]
};

export default admin;
