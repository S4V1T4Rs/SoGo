//MenuList.js
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import NavGroup from './NavGroup';
import MenuCard from '../MenuCard';
import menuItems from 'menu-items';

const MenuList = () => {
  const users = useSelector((state) => state.auth.user);

  // Verificar si hay usuarios y si al menos uno tiene la propiedad 'Estado' y 'selectRol'
  const currentUser = users.find((user) => user[' Estado '] && user[' Estado '].selectRol);

  if (!currentUser) {
    return (
      <Typography variant="h6" color="error" align="center">
        Usuario no autenticado o información del rol no disponible
      </Typography>
    );
  }

  const roles = currentUser[' Estado '].selectRol;

  console.log('El valor de selectRol es:', roles); // Agregar este console.log para mostrar el valor de selectRol

  let navItems = [];

  if (roles === 'Administrador') {
    navItems = menuItems.items
      .filter((item) => ['admins', 'hhrr', 'cuenta'].includes(item.id))
      .map((item) => <NavGroup key={item.id} item={item} />);
  }

  if (roles === 'Candidato') {
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
