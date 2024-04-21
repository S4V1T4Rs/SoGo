import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

export const DynamicTextFieldGroup = ({
  numberOfFields,
  handleBlur,
  handleKeyPress,
  onChange,
  isOnline,
  isLocalDatabaseActive,
  labelNames,
  fieldTypes,
  ...props
}) => {
  // const [formValues, setFormValues] = useState(Array(numberOfFields).fill(''));
  const [formValues, setFormValues] = useState({});
  const [touchedFields, setTouchedFields] = useState(Array(numberOfFields).fill(false));
  const [errorMessages, setErrorMessages] = useState(Array(numberOfFields).fill(''));

  useEffect(() => {
    // Recuperar el estado de los campos tocados del almacenamiento local al cargar la página
    const storedTouchedFields = JSON.parse(localStorage.getItem('touchedFields')) || Array(numberOfFields).fill(false);
    setTouchedFields(storedTouchedFields);
  }, [numberOfFields]);

  const handleChange = (index, value) => {
    const newFormValues = [...formValues];
    newFormValues[index] = value;
    setFormValues(newFormValues);

    onChange(newFormValues);
  };

  const handleFieldClick = (index) => {
    // Marcar el campo como tocado
    const newTouchedFields = [...touchedFields];
    newTouchedFields[index] = true;
    setTouchedFields(newTouchedFields);
  };

  const handleBlurEvent = (index) => {
    // Manejar eventos de pérdida de foco
    handleBlur(index);
    // Guardar el estado actual de los campos tocados en el almacenamiento local
    localStorage.setItem('touchedFields', JSON.stringify(touchedFields));

    // Mostrar el mensaje de error y configurar el temporizador para ocultarlo después de 4 segundos
    if (!formValues[index]) {
      const newErrorMessages = [...errorMessages];
      newErrorMessages[index] = 'Este campo es obligatorio';
      setErrorMessages(newErrorMessages);

      setTimeout(() => {
        const resetErrorMessages = [...errorMessages];
        resetErrorMessages[index] = '';
        setErrorMessages(resetErrorMessages);
      }, 4000);
    }
  };

  return (
    <>
      {Array.from({ length: numberOfFields }, (_, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <TextField
            fullWidth
            label={labelNames[index] || `Field ${index + 1}`}
            margin="normal"
            name={`field-${index}`}
            type={fieldTypes[index] || 'text'}
            value={formValues[index]}
            onBlur={() => handleBlurEvent(index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onChange={(e) => handleChange(index, e.target.value)}
            disabled={!isOnline && !isLocalDatabaseActive}
            InputLabelProps={index === 4 ? { shrink: true } : null}
            placeholder={index === 4 ? '\u00A0' : null}
            // Cambiar el color del borde al hacer clic o si no se ha detectado ningún dato
            error={!formValues[index] && touchedFields[index]}
            onClick={() => handleFieldClick(index)}
            color="secondary" // Cambiar a "primary" o cualquier otro color según tus preferencias
            {...props}
          />
          <div style={{ color: 'red', marginTop: '8px' }}>{errorMessages[index]}</div>
        </Grid>
      ))}
    </>
  );
};
DynamicTextFieldGroup.propTypes = {
  numberOfFields: PropTypes.number.isRequired,
  handleBlur: PropTypes.func,
  handleKeyPress: PropTypes.func,
  onChange: PropTypes.func,
  isOnline: PropTypes.bool, // Agregar isOnline a las propiedades validadas
  isLocalDatabaseActive: PropTypes.bool,
  labelNames: PropTypes.array,
  fieldTypes: PropTypes.array
  // Resto de las props
};
