// TextDinamic.js
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheetManager } from 'styled-components';

import PropTypes from 'prop-types';
import { InputContainer, Label, StyledInput, StyledSelect, TextDinamicWrapper } from './styled';
import { handleInputChange, handleInputBlur } from './function.js'; // Importa las funciones desde functions.js

const TextDinamic = ({ number, labels, values, names, types, placeholders, maxLength, mensaje, capitalization, onChange, localbase }) => {
  //const [inputValues, setInputValues] = useState(values || Array.from({ length: number }, () => ''));
  const [inputValues, setInputValues] = useState(values.length ? values : Array.from({ length: number }, () => ''));
  const [inputErrors, setInputErrors] = useState(Array.from({ length: number }, () => false));
  const [age, setAge] = useState('');
  const inputRefs = useRef(Array.from({ length: number }, () => React.createRef()));
  useEffect(() => {
    setInputValues(values.length ? values : Array.from({ length: number }, () => ''));
  }, [values, number]);

  useEffect(() => {
    const calculateAge = () => {
      if (inputValues[4]) {
        const birthDate = new Date(inputValues[4]);
        const today = new Date();
        const ageDiff = today.getFullYear() - birthDate.getFullYear();
        const isMonthBeforeBirthMonth = today.getMonth() < birthDate.getMonth();
        const isMonthEqualToBirthMonth = today.getMonth() === birthDate.getMonth();
        const isDayBeforeBirthDay = today.getDate() < birthDate.getDate();

        const calculatedAge = isMonthBeforeBirthMonth || (isMonthEqualToBirthMonth && isDayBeforeBirthDay) ? ageDiff - 1 : ageDiff;

        setAge(calculatedAge);
      }
    };

    calculateAge();
  }, [inputValues]); // Agregar inputValues al arreglo de dependencias

  const handleInputChangeWrapper = (index, value) => {
    if (types && types[index] === 'select-document') {
      if (value === 'DNI' || value === 'PASAPORTE') {
        const newValues = [...inputValues];
        newValues[index] = value;
        setInputValues(newValues);
        onChange(newValues);
      }
    } else if (names && names[index] === 'documentNumber') {
      // Limitar la entrada a 8 caracteres
      if (value.length <= 8) {
        handleInputChange(
          index,
          value,
          types,
          maxLength,
          inputValues,
          setInputValues,
          onChange,
          capitalization,
          inputErrors,
          setInputErrors,
          age,
          setAge
        );
        //onChange({ [names[index]]: value });
      }
    } else {
      // Código existente para otros tipos de campos
      handleInputChange(
        index,
        value,
        types,
        maxLength,
        inputValues,
        setInputValues,
        onChange,
        capitalization,
        inputErrors,
        setInputErrors,
        age,
        setAge
      );
    }
  };

  const handleInputBlurWrapper = (index) => {
    handleInputBlur(index, inputValues, setInputErrors, inputErrors);
  };

  const handleKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < number) {
        const nextInput = inputRefs.current[nextIndex];
        if (nextInput && nextInput.current) {
          nextInput.current.focus();
        }
      }
    } else if (e.key === '.') {
      e.preventDefault();
      const prevIndex = index - 1;
      if (prevIndex >= 0) {
        const prevInput = inputRefs.current[prevIndex];
        if (prevInput && prevInput.current) {
          prevInput.current.focus();
        }
      }
    }
  };

  return (
    <TextDinamicWrapper>
      {Array.from({ length: number }, (_, index) => (
        <InputContainer key={index}>
          <Label>{labels && labels[index] ? labels[index] : ''}</Label>
          <StyleSheetManager shouldForwardProp={(prop) => prop !== 'fullwidth'}>
            {types && types[index] === 'select-document' ? (
              <StyledSelect
                fullwidth={true}
                ref={inputRefs.current[index]}
                onKeyPress={(e) => handleKeyPress(e, index)}
                name={names && names[index] ? names[index] : ''}
                value={inputValues[index]}
                error={inputErrors[index]}
                onBlur={() => handleInputBlurWrapper(index)}
                onChange={(e) => handleInputChangeWrapper(index, e.target.value)}
                disabled={localbase}
              >
                {/* Opciones para el selector, puedes personalizar según tus necesidades */}
                <option value="">Seleccionar...</option>
                <option value="DNI">DNI</option>
                <option value="PASAPORTE">Pasaporte</option>
                {/* Más opciones según sea necesario */}
              </StyledSelect>
            ) : types && types[index] === 'select-gender' ? (
              <StyledSelect
                fullwidth={true}
                ref={inputRefs.current[index]}
                onKeyPress={(e) => handleKeyPress(e, index)}
                name={names && names[index] ? names[index] : ''}
                value={inputValues[index]}
                error={inputErrors[index]}
                onBlur={() => handleInputBlurWrapper(index)}
                onChange={(e) => handleInputChangeWrapper(index, e.target.value)}
                disabled={localbase}
              >
                {/* Opciones para el selector de género */}
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                {/* Más opciones según sea necesario */}
              </StyledSelect>
            ) : index === 6 ? (
              <StyledInput
                fullwidth={true}
                ref={inputRefs.current[index]}
                onKeyPress={(e) => handleKeyPress(e, index)}
                name={names && names[index] ? names[index] : ''}
                type={types && types[index] ? types[index] : ''}
                value={age}
                disabled
              />
            ) : (
              <StyledInput
                fullwidth={true}
                ref={inputRefs.current[index]}
                name={names && names[index] ? names[index] : ''}
                type={types && types[index] ? types[index] : 'text'}
                value={inputValues[index]}
                error={inputErrors[index]}
                onBlur={() => handleInputBlurWrapper(index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onChange={(e) => handleInputChangeWrapper(index, e.target.value)}
                placeholder={placeholders && placeholders[index] ? placeholders[index] : ''}
                maxLength={names && names[index] === 'documentNumber' ? 8 : undefined}
                disabled={localbase}
              />
            )}
          </StyleSheetManager>
          {mensaje === 'campo' && names[index] === 'documentNumber' && inputValues[index].length !== 8 && inputValues[index].length > 0 && (
            <span style={{ color: 'red' }}>El número de documento debe tener exactamente 8 caracteres.</span>
          )}
        </InputContainer>
      ))}
    </TextDinamicWrapper>
  );
};

// Define los PropTypes
TextDinamic.propTypes = {
  number: PropTypes.number.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string),
  values: PropTypes.arrayOf(PropTypes.string),
  names: PropTypes.arrayOf(PropTypes.string),
  types: PropTypes.arrayOf(PropTypes.string),
  placeholders: PropTypes.arrayOf(PropTypes.string),
  maxLength: PropTypes.number,
  mensaje: PropTypes.string,
  capitalization: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  localbase: PropTypes.any
};

export default TextDinamic;
