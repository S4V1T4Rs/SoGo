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
          title: 'Candidatos',
          type: 'item',
          url: '/users/call',
          target: false
        },
        {
          id: 'vacancies',
          title: 'Vacantes',
          type: 'item',
          url: '/users/vacancies',
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
