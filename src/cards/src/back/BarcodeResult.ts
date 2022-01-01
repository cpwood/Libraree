export default class BarcodeResult {
    type: string;
    code: string;

    constructor(type: string, code: string) {
        this.type = type;
        this.code = code;
    }

    isMatch(number: string): boolean {
        return this.code.replace(/[^0-9A-Z]/gi, '').indexOf(number.replace(/[^0-9A-Z]/gi, '')) >= 0;
    }
}