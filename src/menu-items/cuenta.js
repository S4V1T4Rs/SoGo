//cuenta.js
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

const cuenta = {
  id: 'cuenta',
  title: 'Candidato',
  caption: 'supervisa usuarios y configuraciones',
  type: 'group',
  children: [
    {
      id: 'cuenta',
      title: 'Notificaciones',
      type: 'item',
      url: '/candidate/notificaciones',
      icon: icons.IconUsers
    }
  ]
};

export default cuenta;
