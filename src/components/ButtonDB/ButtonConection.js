import { Box, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DatabaseIcon from '@mui/icons-material/Storage';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types'; // Asegúrate de importar PropTypes

/**
 * Componente de conexión.
 *
 * @component
 * @param {Object} props - Las propiedades del componente.
 * @param {function} props.onClick - Función que se ejecuta al hacer clic en el botón.
 * @returns {JSX.Element} - Elemento JSX que representa el componente.
 */
export const Conecction = ({ onClick, validacion }) => {
  return (
    <Grid item xs={12} sm={6}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <IconButton
          style={{
            backgroundColor: validacion ? '#60C861' : '#FF6565',
            color: 'white',
            borderRadius: '5px'
          }}
          onClick={onClick}
        >
          {validacion ? (
            <>
              <DatabaseIcon fontSize="large" />
              <CheckCircleIcon fontSize="large" />
            </>
          ) : (
            <>
              <DatabaseIcon fontSize="large" />
              <CancelIcon fontSize="large" />
            </>
          )}
        </IconButton>
      </Box>
    </Grid>
  );
};

Conecction.propTypes = {
  onClick: PropTypes.func.isRequired, // El prop onClick debería ser una función
  validacion: PropTypes.any.isRequired // Asegúrate de agregar este prop
};
