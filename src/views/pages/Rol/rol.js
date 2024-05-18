// src/styledComponents.js
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f5f6fa;
  min-height: 100vh;
`;

export const Board = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

export const Column = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 200px;
  min-height: 400px;
  padding: 10px;
`;

export const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

export const ColumnBody = styled.div`
  padding: 10px;
`;

export const AddButton = styled.button`
  background-color: #7d4cdb;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #5c2db0;
  }
`;
// src/App.js
import React from 'react';

const Trees = () => {
  const columns = [
    { id: 1, title: 'Nuevo' },
    { id: 2, title: 'Aceptado' },
    { id: 3, title: 'Entrevista' },
    { id: 4, title: 'Seleccionado' },
    { id: 5, title: 'Descartado' }
  ];

  return (
    <Container>
      <Board>
        {columns.map((column) => (
          <Column key={column.id}>
            <ColumnHeader>
              <span>{column.title}</span>
              <AddButton>+ Añadir</AddButton>
            </ColumnHeader>
            <ColumnBody>{/* Aquí puedes agregar los elementos de cada columna */}</ColumnBody>
          </Column>
        ))}
      </Board>
    </Container>
  );
};

export default Trees;
