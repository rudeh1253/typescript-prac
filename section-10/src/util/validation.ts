// Input validation
export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(validatableInput: Validatable): boolean {
    let isValid = true;
    const { value, required, minLength, maxLength, min, max } =
        validatableInput;

    if (required) {
        isValid = isValid && value !== 0;
    }
    if (minLength && typeof value === "string") {
        isValid = isValid && value.length >= minLength;
    }
    if (maxLength && typeof value === "string") {
        isValid = isValid && value.length <= maxLength;
    }
    if (min && typeof value === "number") {
        isValid = isValid && value >= min;
    }
    if (max && typeof value === "number") {
        isValid = isValid && value <= max;
    }
    return isValid;
}
