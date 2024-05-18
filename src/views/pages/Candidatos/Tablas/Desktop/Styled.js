import { TableCell } from '@mui/material';
import styled from 'styled-components';
export const ContainerButton = styled.div`
  display: flex;
  justify-content: center;
  /* background-color: red; */
  gap: 15px;
`;
export const NeumorphicButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #b5b3b3;
  background-color: transparent;
  box-shadow:
    5px 5px 10px #bebebe,
    -5px -5px 10px #ffffff;
  transition: box-shadow 0.3s ease;
  cursor: pointer;

  &:active {
    box-shadow:
      inset 2px 2px 5px #bebebe,
      inset -2px -2px 5px #ffffff;
  }
`;

export const EditButton = styled(NeumorphicButton)`
  margin-right: 5px;
`;

export const DeleteButton = styled(NeumorphicButton)`
  margin-right: 5px;
`;

export const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  display: flex;
  gap: 15px;
`;

export const NeumorphicTableCell = styled(TableCell)`
  text-align: center;
  background-color: #f7f7f7;
  border: 2px solid #dcdcdc;
`;

export const NeumorphicTableHeaderCell = styled(TableCell)`
  text-align: center;
  background-color: #403f3f;
  color: white;
  border: 2px solid #7a7878;
  white-space: nowrap;
  cursor: col-resize;
`;

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
`;


// Estilo del componente select
export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5em;
  margin: 0.5em 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  background-color: #f9f9f9;
  &:focus {
    outline: none;
    border-color: #007BFF;
  }
`;

// Estilo para las opciones (opcional, ya que no todos los navegadores soportan el estilo directo en option)
export const StyledOption = styled.option`
  padding: 0.5em;
  background-color: red;
  color: #333;
  &:hover {
    background-color: #007BFF;
    color: #fff;
  }
`;