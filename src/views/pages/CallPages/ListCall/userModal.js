import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Backdrop, Fade } from '@mui/material';
import styled from 'styled-components';

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f0f0f0; /* Color de fondo */
  padding: 20px;
  border-radius: 16px; /* Mayor valor para el efecto neumórfico */
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.2), -4px -4px 8px rgba(255, 255, 255, 0.2); /* Efecto de sombra */
`;

const EditUserModal = ({ open, handleClose, user }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500
      }}
    >
      <Fade in={open}>
        <ModalContainer>
          {user && (
            <div>
              <h2>Editar Usuario</h2>
              <p>Nombre: {user['Datos Personales']?.Nombre}</p>
              <p>Apellido: {user['Datos Personales']?.Apellido}</p>
              <p>Edad: {user['Datos Personales']?.Edad}</p>
              {/* Agrega más campos aquí según sea necesario */}
              {/* Agrega los campos de entrada para editar los datos del usuario */}
              {/* Por ejemplo: */}
              {/* <input type="text" value={user['Datos Personales']?.Nombre} onChange={(e) => setEditUser({ ...user, 'Datos Personales': { ...user['Datos Personales'], Nombre: e.target.value } })} /> */}
            </div>
          )}
        </ModalContainer>
      </Fade>
    </Modal>
  );
};

EditUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

export default EditUserModal;
