import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;
`;

const Card = styled.div`
  flex: 1;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;

    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }

    button {
      background-color: ${(props) => props.buttonColor};
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      cursor: pointer;

      &:hover {
        filter: brightness(110%);
      }
    }
  }

  .content {
    text-align: center;
    font-size: 0.875rem;
  }

  .info {
    margin-top: 1rem;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    font-weight: 600;

    h3 {
      font-size: 1rem;
    }

    p {
      font-size: 0.75rem;
    }
  }
`;

export default function TableCand({ vacancyColors }) {
  return (
    <Container>
      <Card buttonColor={vacancyColors['Nuevo']}>
        <div className="header">
          <h2>Nuevo</h2>
          <button>+ Añadir</button>
        </div>
        <div className="content">0</div>
      </Card>

      <Card buttonColor={vacancyColors['Aceptado']}>
        <div className="header">
          <h2>Aceptado</h2>
          <button>+ Añadir</button>
        </div>
        <div className="content">0</div>
      </Card>

      <Card buttonColor={vacancyColors['Entrevista']}>
        <div className="header">
          <h2>Entrevista</h2>
          <button>+ Añadir</button>
        </div>
        <div className="content">0</div>
      </Card>

      <Card buttonColor={vacancyColors['Seleccionado']}>
        <div className="header">
          <h2>Seleccionado</h2>
          <button>+ Añadir</button>
        </div>
        <div className="content">1</div>
        <div className="info">
          <h3>Hugo Soto</h3>
          <p>Añadido por Person1 Apellido2</p>
          <p>Hoy</p>
        </div>
      </Card>

      <Card buttonColor={vacancyColors['Descartado']}>
        <div className="header">
          <h2>Descartado</h2>
          <button>+ Añadir</button>
        </div>
        <div className="content">0</div>
      </Card>
    </Container>
  );
}
