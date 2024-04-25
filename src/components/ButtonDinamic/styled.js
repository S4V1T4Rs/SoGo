import { Card } from '@mui/material';
import styled from 'styled-components';
export const TextDinamicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 40px;
  margin-bottom: 20px;
  //background-color: red;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 50px;
  flex-direction: column;
`;

export const StyledSelect = styled.select.attrs((props) => ({
  type: props.type || 'select',
  error: props.error ? props.error.toString() : undefined // Convertir a cadena de texto si es true
}))`
  width: ${(props) => (props.fullwidth ? '100%' : 'auto')};
  padding: 12px;
  border: 1px solid ${(props) => (props.error ? 'red' : '#ced4da')};
  border-radius: 4px;
  background-color: #fff;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const StyledInput = styled.input.attrs((props) => ({
  type: props.type || 'text',
  error: props.error ? props.error.toString() : undefined // Convierte a cadena de texto si es true
}))`
  width: ${(props) => (props.fullwidth ? '100%' : 'auto')};
  padding: 12px;
  border: 1px solid ${(props) => (props.error ? 'red' : '#ced4da')};
  border-radius: 4px;
  color: #000;
  background-color: #fff;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const Label = styled.label`
  position: absolute;
  top: -40px;
  left: 0px;
  background: #f0f3f5; /* Color de fondo */
  border-radius: 10px;
  /* box-shadow:
    -5px -5px 10px #ffffff,
    5px 5px 10px #babecc; Sombras suaves para el efecto neumórfico */
  font-size: 14px;
  color: #495057;
  transition: box-shadow 0.3s ease; /* Transición suave */
  padding: 5px 15px;
  border: 1px solid #d2d0d0;
`;
// Define un nuevo componente StyledCard para el contenedor del card
export const StyledCard = styled(Card)`
  width: 300px; /* Ajusta el ancho del card según tus necesidades */
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

// Define un nuevo componente StyledSearchInput para el campo de búsqueda
export const StyledSearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// Define un nuevo componente StyledDepartmentItem para los elementos de la lista de departamentos
export const StyledDepartmentItem = styled.div`
  padding: 8px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

// Define un nuevo componente StyledCreateDepartmentButton para el botón de crear departamento
export const StyledCreateDepartmentButton = styled.button`
  padding: 8px 16px;
  margin-top: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
export const StyledSaveButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745; /* Color de fondo */
  color: #fff; /* Color del texto */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838; /* Color de fondo al pasar el ratón */
  }
`;
export const StyledSaveInput = styled.input`
  width: calc(100% - 110px); /* Ajusta el ancho del input */
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
