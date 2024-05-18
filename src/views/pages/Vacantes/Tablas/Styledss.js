import styled from 'styled-components';
export const ProgressContainer = styled.div`
  padding: 2rem;
  box-shadow:
    10px 10px 10px -2px rgba(0, 0, 0, 0.15),
    -10px -10px 10px -2px rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.3s ease;
  border: 0.05px solid ${({ color }) => color};
  &:hover {
    background-color: ${({ color }) => (color ? `rgba(${hexToRgb(color)}, 0.3)` : 'rgba(255, 255, 255, 0.3)')};
    cursor: pointer;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 0.125rem;
  background-color: ${({ color }) => color};
  border-radius: 0.125rem;
  margin-bottom: 1.09rem;
  margin-top: -20px;
`;

export const ProgressText = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

export const ColorIcon = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${({ color }) => color};
  border-radius: 50%;
  cursor: pointer;
`;

export const ColorPickerContainer = styled.div`
  position: absolute;
  margin-top: 310px;
  margin-left: 250px;
  z-index: 999;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

export const StyledButton = styled.button`
  padding: 10px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
// Función para convertir un color hexadecimal a rgba
function hexToRgb(hex) {
  // Verificar si hex es una cadena de texto
  if (typeof hex !== 'string' || !hex.startsWith('#')) return null;
  hex = hex.substring(1); // Elimina el #
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 1rem;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const Card = styled.div`
  position: relative;
  min-width: 261px;
  max-width: 350px;
  padding: 1rem;
  margin-bottom: 1rem;
  margin-top: 2rem;
  margin-left: 1rem;
  border: 1px solid ${(props) => props.buttonColor};
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

  @media (max-width: 600px) {
    min-width: auto;
    max-width: 100%;
  }
`;
export const BackButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    3px 3px 10px rgba(0, 0, 0, 0.2),
    -3px -3px 10px rgba(255, 255, 255, 0.5);

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    border-color: ${({ theme }) => theme.buttonHoverBorder};
    color: ${({ theme }) => theme.buttonHoverText};
    box-shadow:
      5px 5px 10px rgba(0, 0, 0, 0.2),
      -5px -5px 10px rgba(255, 255, 255, 0.5);
  }
`;
