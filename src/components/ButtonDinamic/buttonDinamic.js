// TextDinamic.js

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheetManager } from 'styled-components';

import PropTypes from 'prop-types';
import {
  InputContainer,
  Label,
  StyledCard,
  StyledCreateDepartmentButton,
  StyledDepartmentItem,
  StyledInput,
  StyledSaveButton,
  StyledSaveInput,
  StyledSearchInput,
  StyledSelect,
  TextDinamicWrapper
} from './styled';
import { handleInputChange, handleInputBlur } from './function.js'; // Importa las funciones desde functions.js

import { Delete } from '@mui/icons-material';
import axios from 'axios';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from 'api/config/configfire';

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
  const [showCard, setShowCard] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showCreateDepartmentInput, setShowCreateDepartmentInput] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('Seleccionar...');
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/departamento');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  // Dentro del componente, actualiza el estado del departamento seleccionado
  useEffect(() => {
    // Actualiza el estado interno del componente con el nuevo valor del departamento seleccionado
    setSelectedDepartment(selectedDepartment);
  }, [selectedDepartment]);

  const handleSaveDepartment = async () => {
    try {
      // Crear objeto con el nombre del nuevo departamento
      const newDepartment = { departmentName: newDepartmentName };

      // Enviar una solicitud POST al endpoint de tu API para crear el nuevo departamento
      const response = await axios.post('http://localhost:8080/api/departamento', newDepartment);

      // Manejar la respuesta según sea necesario (por ejemplo, actualizar el estado global)
      console.log('Respuesta de la API:', response.data);

      // Actualizar el estado local con el nuevo departamento
      setDepartments([...departments, response.data]);

      // Limpiar el campo de entrada del nuevo nombre de departamento
      setNewDepartmentName('');
      // Restablecer el departamento seleccionado a 'Seleccionar...'
      setSelectedDepartment('Seleccionar...');
      // Ocultar el campo de entrada después de guardar
      setShowCreateDepartmentInput(false);
      const nextId = response.data.departmentId;
      const departmentsRef = collection(db, 'Departamentos');
      await setDoc(doc(departmentsRef, nextId.toString()), {
        departmentId: nextId.toString(),
        'Detalles de Departamentos': newDepartment
      });
    } catch (error) {
      console.error('Error al guardar el nuevo departamento:', error);
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error);
      }
      // Manejar el error según sea necesario
    }
  };

  // const handleSaveDepartment = () => {
  //   const newDepartment = { id: departments.length + 1, NombreDepartamento: newDepartmentName };
  //   setDepartments([...departments, newDepartment]);
  //   setNewDepartmentName('');
  //   setShowCreateDepartmentInput(false); // Volver al botón de crear después de guardar
  // };
  const handleDeleteDepartment = async (departmentId) => {
    try {
      // Eliminar el departamento localmente
      const updatedDepartments = departments.filter((department) => department.departmentId !== departmentId);
      setDepartments(updatedDepartments);

      // Enviar una solicitud DELETE a la API para eliminar el departamento
      await axios.delete(`http://localhost:8080/api/departamento/${departmentId}`);

      // Puedes agregar más lógica aquí, como actualizar el estado global si es necesario
    } catch (error) {
      console.error('Error al eliminar departamento:', error);
      // Manejar el error según sea necesario
    }
  };

  const handleDepartmentSelection = (departmentName) => {
    setSelectedDepartment(departmentName);
    const departmentsIndex = names.indexOf('department');
    if (departmentsIndex !== -1) {
      const newInputValues = [...inputValues];
      newInputValues[departmentsIndex] = departmentName;
      setInputValues(newInputValues);
      onChange(newInputValues);
    }
    setShowCard(false); // Desaparecer el Card al seleccionar un departamento
  };

  return (
    <TextDinamicWrapper>
      {Array.from({ length: number }, (_, index) => (
        <InputContainer key={index}>
          <Label>{labels && labels[index] ? labels[index] : ''}</Label>
          <StyleSheetManager shouldForwardProp={(prop) => prop !== 'fullwidth'}>
            {types && types[index] === 'select-departament' ? (
              <>
                <StyledInput
                  fullwidth={true}
                  ref={inputRefs.current[index]}
                  name={names && names[index] ? names[index] : ''}
                  type="select"
                  value={selectedDepartment}
                  error={inputErrors[index]}
                  disabled={localbase}
                  onClick={() => setShowCard(true)}
                />
                {showCard && (
                  <StyledCard>
                    <>
                      <div>
                        <StyledSearchInput type="text" placeholder="Buscar departamento" />
                      </div>
                      <div>
                        {departments.map((department, index) => (
                          <React.Fragment key={index}>
                            <StyledDepartmentItem onClick={() => handleDepartmentSelection(department.departmentName)}>
                              {department.departmentId}) {department.departmentName}{' '}
                              <StyledSaveButton onClick={() => handleDeleteDepartment(department.departmentId)}>
                                <Delete />
                              </StyledSaveButton>
                            </StyledDepartmentItem>
                          </React.Fragment>
                        ))}
                      </div>
                      <div>
                        {!showCreateDepartmentInput && (
                          <StyledCreateDepartmentButton onClick={() => setShowCreateDepartmentInput(true)}>
                            Crear departamento
                          </StyledCreateDepartmentButton>
                        )}
                        {showCreateDepartmentInput && (
                          <>
                            <StyledSaveInput type="text" value={newDepartmentName} onChange={(e) => setNewDepartmentName(e.target.value)} />
                            <StyledSaveButton onClick={handleSaveDepartment}>Guardar</StyledSaveButton>
                          </>
                        )}
                      </div>
                    </>
                  </StyledCard>
                )}
              </>
            ) : types && types[index] === 'select-document' ? (
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
