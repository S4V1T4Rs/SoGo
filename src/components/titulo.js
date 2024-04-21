import PropTypes from 'prop-types';
import { Box, Button, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
/**
 * Componente de título.
 *
 * @component
 * @example
 * // Para obtener autocompletado, puedes usar el siguiente ejemplo:
 * // <Title titulo="Mi Título" />
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.titulo - El título que se mostrará en el botón.
 * @returns {JSX.Element} - Elemento JSX que representa el componente.
 */
export const Title = ({ titulo }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  return (
    <>
      <Box sx={{ alignItems: 'center', display: 'flex' }}>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
        <Button
          variant="outlined"
          sx={{
            cursor: 'unset',
            m: 2,
            py: 0.5,
            px: 7,
            borderColor: `${theme.palette.grey[400]} !important`,
            color: `${theme.palette.grey[500]} !important`,
            fontWeight: 500,
            borderRadius: `${customization.borderRadius}px`
          }}
          disableRipple
          disabled
        >
          {titulo}
        </Button>
        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
      </Box>
    </>
  );
};

Title.propTypes = {
  titulo: PropTypes.string.isRequired
};
