export default interface Validator {
    isValid: (value: string) => boolean;
    error: string;
}
