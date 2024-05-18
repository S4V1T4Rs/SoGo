import React from 'react';
import styled from 'styled-components';

const ColumnWrapper = styled.div`
  flex: 1;
  margin: 0 8px;
  background: #f4f5f7;
  border-radius: 4px;
  padding: 16px;
`;

const ColumnHeader = styled.h2`
  font-size: 16px;
  margin-bottom: 16px;
`;

const Column = ({ title, children }) => {
  return (
    <ColumnWrapper>
      <ColumnHeader>{title}</ColumnHeader>
      {children}
    </ColumnWrapper>
  );
};

const CardWrapper = styled.div`
  background: white;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

const Card = ({ children }) => {
  return <CardWrapper>{children}</CardWrapper>;
};
const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-bottom: 1px solid #eaeaea;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Title>Tablero de Candidatos</Title>
      <button>Añadir candidato</button>
    </HeaderWrapper>
  );
};
const BoardWrapper = styled.div`
  display: flex;
  padding: 16px;
`;

const PermisoRolComponent = () => {
  return (
    <>
      <Header />
      <BoardWrapper>
        <Column title="Nuevo">
          <Card>Candidato 1</Card>
          <Card>Candidato 2</Card>
        </Column>
        <Column title="Aceptado">
          <Card>Candidato 3</Card>
        </Column>
        <Column title="Entrevista">
          <Card>Candidato 4</Card>
        </Column>
        <Column title="Seleccionado">
          <Card>Candidato 5</Card>
        </Column>
        <Column title="Descartado">
          <Card>Candidato 6</Card>
        </Column>
      </BoardWrapper>
    </>
  );
};
export default PermisoRolComponent;
