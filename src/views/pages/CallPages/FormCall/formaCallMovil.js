//tabsstyled.js
import styled from 'styled-components';
export const TabContainer = styled.div`
  display: flex;
  overflow-x: auto; /* Agregar scroll horizontal */
  max-width: 100%; /* Ajustar al ancho máximo */
  margin-bottom: 10px; /* Agregar margen inferior opcional */

  /* Establecer ancho fijo para cada tab */
  > div {
    flex-shrink: 0;
    width: 100px; /* Ajustar según tus necesidades */
  }
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  scroll-snap-align: start;
  align-items: center;
  padding: 1.4em;
  border-radius: 10px;
  box-shadow:
    6px 6px 10px -1px rgba(0, 0, 0, 0.15),
    -6px -6px 10px -1px rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  margin: 10px;
  margin-left: 25px;
  margin-right: -15px;

  transition: transform 0.5s;

  box-shadow: ${(props) =>
    props.$active
      ? 'inset 4px 4px 6px -1px rgba(0, 0, 0, 0.2), inset -4px -4px 6px -1px rgba(255, 255, 255, 0.7), -0.5px -0.5px 0px rgba(255, 255, 255, 1), 0.5px 0.5px 0px rgba(0, 0, 0, 0.15), 0px 12px 10px -10px rgba(0, 0, 0, 0.05)'
      : '5px 5px 5px #d0d0d0, -5px -5px 5px #ffffff'};

  transform: translateY(1px);
`;
export const Labels = styled.label`
  color: #5a5a5a;
  font-size: 12px;
`;
export const FormContent = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow:
    6px 6px 10px -1px rgba(0, 0, 0, 0.15),
    -6px -6px 10px -1px rgba(255, 255, 255, 255);
  border: 2px solid #e8e8e8;
  width: 95%;
  margin: 0 auto;
`;
export const MessageCard = styled.div`
  padding: 10px;
  border-radius: 10px;
  box-shadow:
    4px 4px 2px -1px rgba(0, 0, 0, 0.15),
    -4px -4px 2px -1px rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  text-align: center;
  //margin-left: 20px;
  //margin-right: -5px;
  //margin-left: 20px;
  color: ${({ type }) => (type === 'error' ? 'red' : 'green')};
`;
// Estilos para los botones de navegación
export const NavigationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
`;
// Función para calcular la cantidad de tabs visibles en función del tamaño de la pantalla
export const calculateVisibleTabs = (isMobile) => {
  return isMobile ? 3 : 4;
};
