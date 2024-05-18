import { IconUserCheck } from '@tabler/icons-react';

const icons = {
  IconUserCheck
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const hhrr = {
  id: 'user-management',
  title: 'Gestion HH.RR',
  caption: 'Gestion de Usuarios',
  type: 'group',
  children: [
    {
      id: 'reclutamiento',
      title: 'Reclutamiento',
      type: 'collapse',
      icon: icons.IconUserCheck,

      children: [
        {
          id: 'candidate',
          title: 'Candidatos',
          type: 'item',
          url: '/rrhh/candidate',
          target: false
        },
        {
          id: 'vacancies',
          title: 'Vacantes',
          type: 'item',
          url: '/rrhh/vacancies',
          target: false
        },
        {
          id: 'mensaje',
          title: 'Mensaje',
          type: 'item',
          url: '/rrhh/mensajes',
          target: false
        }
      ]
    }
  ]
};

export default hhrr;
