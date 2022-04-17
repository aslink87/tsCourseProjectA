// Validation

// interface to define structure of an object, only require 'value'
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  // min & max to check value of number, not string
  min?: number;
  max?: number;
}

export function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    // required input is not empty
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  // check minLength and include typguard to exclude numbers
  // '!= null' allows us to run this step against 0 values
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

