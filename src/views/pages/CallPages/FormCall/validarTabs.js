//validartabs.js
import { FormFieldsValidator } from './validaciones';

export const isPersonalFormFilled = (personalFormValues, arrays) => {
  return FormFieldsValidator({
    fields: arrays,
    formValues: personalFormValues
  });
};
export const isLaboralFormFilled = (educateFormValues, arrays) => {
  return FormFieldsValidator({
    fields: arrays,
    formValues: educateFormValues
  });
};
export const isCuentaFormFilled = (educateFormValues, arrays) => {
  return FormFieldsValidator({
    fields: arrays,
    formValues: educateFormValues
  });
};
