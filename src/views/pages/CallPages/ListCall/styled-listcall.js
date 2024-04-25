import { TableCell } from '@mui/material';
import styled from 'styled-components';
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
