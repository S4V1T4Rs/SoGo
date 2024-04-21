import { IconUserCheck } from '@tabler/icons-react';

const icons = {
  IconUserCheck
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'user-management',
  title: 'Gestion HH.RR',
  caption: 'Gestion de Usuarios',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Reclutamiento',
      type: 'collapse',
      icon: icons.IconUserCheck,

      children: [
        {
          id: 'call',
          title: 'Convocatoria',
          type: 'item',
          url: '/users/call',
          target: false
        },
        {
          id: 'hire',
          title: 'Contratar',
          type: 'item',
          url: '/users/hire',
          target: false
        },
        {
          id: 'hire',
          title: 'Contratar',
          type: 'item',
          url: '/users/hire',
          target: false
        }
      ]
    }
  ]
};

export default pages;
