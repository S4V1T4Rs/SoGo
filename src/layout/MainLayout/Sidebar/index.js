// Importamos PropTypes de 'prop-types'. PropTypes se utiliza para documentar los tipos de propiedades que se pasan a los componentes.
import PropTypes from 'prop-types';

// Importamos useTheme de '@mui/material/styles'. useTheme es un hook que nos permite usar el tema en los componentes funcionales.
import { useTheme } from '@mui/material/styles';
// Importamos varios componentes de '@mui/material'. Estos componentes se utilizan en la interfaz de usuario de la aplicación.
import { Avatar, Box, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';

// Importamos PerfectScrollbar de 'react-perfect-scrollbar'. PerfectScrollbar es un componente que permite tener una barra de desplazamiento personalizada.
import PerfectScrollbar from 'react-perfect-scrollbar';
// Importamos BrowserView y MobileView de 'react-device-detect'. Estos componentes nos permiten renderizar diferentes vistas dependiendo del dispositivo del usuario.
import { BrowserView, MobileView } from 'react-device-detect';

// Importamos varios componentes y constantes del proyecto.
import MenuList from './MenuList'; // MenuList es un componente que muestra la lista de menús.
import LogoSection from '../LogoSection'; // LogoSection es un componente que muestra el logo de la aplicación.
// MenuCard es un componente que muestra una tarjeta de menú.
import { drawerWidth } from 'store/constant'; // drawerWidth es una constante que define el ancho del cajón (drawer).
import { useSelector } from 'react-redux';

// Definimos el componente Sidebar. Este componente muestra la barra lateral de la aplicación.
const Sidebar = ({ drawerOpen, drawerToggle, window }) => {
  // Usamos el hook useTheme para acceder al tema actual.
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  // Usamos el hook useMediaQuery para comprobar si el ancho de la ventana coincide con el punto de interrupción 'md' o es mayor.
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  // Definimos el contenido del cajón (drawer).
  const drawer = (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Box sx={{ display: 'flex', p: 2, justifyContent: 'center', mx: 'auto' }}>
          <LogoSection /> {/**Mostramos el logo de la aplicación. */}
        </Box>
      </Box>
      {/**Mostramos una vista diferente si el usuario está en un navegador. */}
      <BrowserView
        style={{
          boxShadow: '5px 5px 10px #b3b3b3, -5px -5px 10px #red',
          background: customization.darkMode ? '#373737' : 'white'
        }}
      >
        <PerfectScrollbar
          component="div"
          style={{
            height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
            paddingLeft: '16px',
            paddingRight: '16px',
            scrollbarColor: 'red auto' // Cambiamos el color del scroll a rojo.
          }}
        >
          <Box component="div" sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center', flexGrow: 2 }}>
            <Box sx={{ display: 'flex', p: 2, justifyContent: 'center', mx: 'auto' }}>
              <Avatar src="/ruta_de_la_imagen.jpg" alt="Avatar" />
            </Box>
            <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
              Administrador
            </Typography>
          </Box>
          <MenuList /> {/**Mostramos la lista de menús. */}
          <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
            {/** Mostramos la versión de la aplicación. */}
          </Stack>
        </PerfectScrollbar>
      </BrowserView>

      {/**Mostramos una vista diferente si el usuario está en un dispositivo móvil. */}
      <MobileView>
        <Box sx={{ px: 2 }}>
          {/**Mostramos la lista de menús. */}

          <Box sx={{ display: 'flex', p: 2, justifyContent: 'center', mx: 'auto' }}>
            <Avatar src="/ruta_de_la_imagen.jpg" alt="Avatar" />
          </Box>
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
            Administrador
          </Typography>

          <MenuList />

          {/**Mostramos una tarjeta de menú. */}
        </Box>
      </MobileView>
    </>
  );

  // Definimos el contenedor del cajón (drawer).
  const container = window !== undefined ? () => window.document.body : undefined;

  // Renderizamos el componente.
  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer} {/**Mostramos el contenido del cajón (drawer). */}
      </Drawer>
    </Box>
  );
};

// Definimos los tipos de las propiedades del componente Sidebar.
Sidebar.propTypes = {
  drawerOpen: PropTypes.bool, // drawerOpen es un booleano que indica si el cajón (drawer) está abierto o no.
  drawerToggle: PropTypes.func, // drawerToggle es una función que se utiliza para abrir y cerrar el cajón (drawer).
  window: PropTypes.object, // window es un objeto que representa la ventana del navegador.
  background: PropTypes.bool
};

// Exportamos el componente Sidebar para que pueda ser utilizado en otras partes de la aplicación.
export default Sidebar;
