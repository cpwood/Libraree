import { plainToInstance, Type } from 'class-transformer';
import Libraries from '../../libraries/libraries.json';

export class LibraryBarcode {
    type: string;
    invalidCharacters: string;
    parseExpression: string;
    renderExpression: string;

    private _stripNumber(number: string): string {
        const re = new RegExp(this.invalidCharacters, 'gi');
        return number.replace(re, '');
    }

    isValid(number: string): boolean {
        number = this._stripNumber(number);
        const re = new RegExp(this.parseExpression, 'gi');
        return re.test(number);
    }

    render(number: string): string {
        const parse = new RegExp(this.parseExpression, 'gi');
        let rendered = this.renderExpression;

        number = this._stripNumber(number);
        const matches = parse.exec(number);

        for (const key of Object.keys(matches.groups)) {
            const replace = new RegExp(`\\{${key}\\}`, 'g');
            rendered = rendered.replace(replace, matches.groups[key]);
        }

        return rendered;
    }
}

export class Library {
    name: string;
    code: string;
    backgroundColour: string;
    labelColour: string;
    textColour: string;

    @Type(() => LibraryBarcode)
    barcode: LibraryBarcode
}

export const LIBRARIES: Library[] = plainToInstance(Library, Libraries);