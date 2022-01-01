import { Screen } from './Screens';
import type Barcode from './Barcode';
import type Library from './Library';
import Libraries from '../../libraries/libraries.json';
import BwipJs from '../bwip-js-min.js';
import { decode } from 'base64-arraybuffer';
import JSZip from 'jszip';

export default class CardContext {
    library: Library;
    number: string;
    name: string;
    image: string;
    croppedImage: string;
    screen = Screen.Home;
    files: WalletFile[] = [];
    type: Barcode;
    scannedNumber: string;
    discovered: boolean;
    pass: Blob;

    get redactedEntered(): string {
        return this.number.replace(/[0-9]/g, '0');
    }

    get redactedScanned(): string {
        return this.scannedNumber.replace(/[0-9]/g, '0');
    }

    generateJson(): void {
        const brand = Libraries.find(x => x.Code == this.library.code);

        const definition = {
            formatVersion: 1,
            passTypeIdentifier: 'pass.org.libraree.cards',
            serialNumber: `${this.library.code}-${this.scannedNumber}`,
            teamIdentifier: 'ZCN8R4T634',
            organizationName: 'CHRISTOPHER PETER WOOD',
            description: 'Library Card',
            logoText: `${this.library.name} Libraries`,
            foregroundColor: this.convertToRgb(brand.TextColour),
            backgroundColor: this.convertToRgb(brand.BackgroundColour),
            labelColor: this.convertToRgb(brand.LabelColour),
            storeCard: {
                auxiliaryFields: [
                    {
                        key: 'name',
                        label: 'Name',
                        value: this.name
                    },
                    {
                        key: 'number',
                        label: 'Number',
                        value: this.number
                    },
                ],
                backFields: [
                    {
                        key : 'website',
                        label : 'Manage your library cards',
                        value : 'https://cards.libraree.org/'
                    }
                ]
            }
        };

        this.files.push(new WalletFile('pass.json', JSON.stringify(definition)));
    }

    async generateBarcodes(canvas: HTMLCanvasElement): Promise<void> {
        await this.generateRegularBarcode(canvas);
        await this.generateLargeBarcode(canvas);
    }

    private async generateRegularBarcode(canvas: HTMLCanvasElement): Promise<void> {
        await BwipJs.toCanvas(canvas, {
            bcid: this.type.writer,
            text: this.scannedNumber,
            scale: 1,
            width: 212,
            height: 112,
            paddingwidth: 100,
            paddingheight: 100,
            includetext: false,
            backgroundcolor: 'FFFFFF'
        });

        let url = canvas.toDataURL('image/png');
        url = url.substring(url.indexOf('base64,') + 7);

        const binary = decode(url);
        this.files.push(new WalletFile('strip.png', null, binary as Uint8Array));
    }

    private async generateLargeBarcode(canvas: HTMLCanvasElement): Promise<void> {
        await BwipJs.toCanvas(canvas, {
            bcid: this.type.writer,
            text: this.scannedNumber,
            scale: 1,
            width: 404,
            height: 145,
            paddingwidth: 220,
            paddingheight: 100,
            includetext: false,
            backgroundcolor: 'FFFFFF'
        });

        let url = canvas.toDataURL('image/png');
        url = url.substring(url.indexOf('base64,') + 7);

        const binary = decode(url);
        this.files.push(new WalletFile('strip@2x.png', null, binary as Uint8Array));
    }

    private convertToRgb(hex: string): string {
        const number = Number.parseInt(hex, 16);
        const red = number >> 16;
        const green = (number >> 8) & 255;
        const blue = number & 255;

        return `rgb(${red}, ${green}, ${blue})`;
    }

    async finalise(binary: ArrayBuffer) : Promise<void> {
         const pass = await JSZip.loadAsync(binary);

        for(const file of this.files) {
            pass.file(file.name, file.bytes as Uint8Array);
        }
        
        this.pass = await pass.generateAsync({type: 'blob'});
    }
}

export class WalletFile {
    name: string;
    bytes: ArrayBuffer;

    constructor(name: string, text: string = null, bytes: ArrayBuffer = null) {
        this.name = name;
        this.bytes = bytes ?? new TextEncoder().encode(text);
    }

    async checksum(): Promise<string> {
        //const shasum = crypto.createHash('sha1');
        //shasum.update(this.bytes);
        //return shasum.digest('hex');
        const buffer = await window.crypto.subtle.digest('SHA-1', this.bytes);
        return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
    }
}