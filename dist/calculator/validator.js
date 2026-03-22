const DISALLOWED = /[^0-9+*\s.]/;
export function assertExpressionCharacters(input) {
    if (DISALLOWED.test(input)) {
        throw new Error("Допустимы только цифры, пробелы, точка, + и *");
    }
}
//# sourceMappingURL=validator.js.map