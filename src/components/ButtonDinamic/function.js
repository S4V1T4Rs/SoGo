// functions.js

export const isValidDate = (dateString) => {
  // Verificar si la cadena cumple con el formato esperado "yyyy-MM-dd"
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  // Verificar si la fecha es válida
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;

  // Verificar si el año, mes y día son válidos
  const [year, month, day] = dateString.split('/');
  if (year.length !== 4) return false; // Año de 4 dígitos
  if (+month < 1 || +month > 12) return false; // Mes entre 1 y 12
  if (+day < 1 || +day > 31) return false; // Día entre 1 y 31

  return true;
};

export const handleInputChange = (index, value, types, maxLength, inputValues, setInputValues, onChange, capitalization) => {
  switch (capitalization) {
    case 'primera':
      value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      break;
    case 'mayuscula':
      value = value.toUpperCase();
      break;
    case 'minuscula':
      value = value.toLowerCase();
      break;
    default:
      break;
  }
  // Verificar si el tipo de entrada es una fecha
  if (types && types[index] === 'date') {
    // Obtener la fecha actual
    const currentDate = new Date();
    // Obtener la fecha ingresada
    const enteredDate = new Date(value);

    // Verificar si la fecha ingresada es mayor que la fecha actual
    if (enteredDate > currentDate) {
      // No modificar el valor si la fecha es mayor que la fecha actual
      return;
    }
    // Si el valor es una fecha válida pero no tiene la longitud completa, no hacer nada
    if (value.length < 'yyyy-MM-dd'.length) {
      return;
    }
    // Cortar la cadena si la longitud es mayor que la longitud mínima esperada para una fecha completa
    value = value.slice(0, 'yyyy-MM-dd'.length);
  } else {
    // Si no es una fecha, simplemente limita la longitud según maxLength
    value = value.slice(0, maxLength);
  }

  const newValues = [...inputValues];
  newValues[index] = value;

  setInputValues(newValues);
  onChange(newValues); // Llama a la función onChange con los nuevos valores
};

export const handleInputBlur = (index, inputValues, setInputErrors, inputErrors) => {
  const newErrors = [...inputErrors];
  newErrors[index] = !inputValues[index]; // Cambia a true si no hay datos
  setInputErrors(newErrors);
};
