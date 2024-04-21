export const calculateAge = (birthdate) => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const FormFieldsValidator = ({ fields, formValues }) => {
  const formValuesFilled = fields.every((key) => formValues[key] && formValues[key].trim() !== '');
  return formValuesFilled;
};
