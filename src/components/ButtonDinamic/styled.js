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
