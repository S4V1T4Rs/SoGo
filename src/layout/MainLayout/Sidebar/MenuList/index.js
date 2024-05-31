import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import MenuCard from '../MenuCard';
import menuItems from 'menu-items';

const MenuList = () => {
  const currentUser = useSelector((state) => state.auth.user.find((user) => user[' Estado '].selectRol));

  if (!currentUser || !currentUser[' Estado '] || !currentUser[' Estado '].selectRol) {
    return (
      <Typography variant="h6" color="error" align="center">
        Usuario no autenticado o información del rol no disponible
      </Typography>
    );
  }

  const roles = currentUser[' Estado '].selectRol;

  let navItems = [];

  if (roles.includes('Administrador')) {
    navItems = menuItems.items
      .filter((item) => ['admins', 'hhrr', 'cuenta'].includes(item.id))
      .map((item) => <NavGroup key={item.id} item={item} />);
  }

  if (roles.includes('Candidato')) {
    navItems = menuItems.items.filter((item) => item.id === 'cuenta').map((item) => <NavGroup key={item.id} item={item} />);
  }

  return (
    <>
      {navItems}
      <MenuCard />
    </>
  );
};

export default MenuList;
