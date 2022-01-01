export const BARCODES: Barcode[] = [
    { type: 'codabar', name: 'Codabar', writer: 'rationalizedCodabar', reader: 'codabar_reader' },
    { type: 'code_128', name: 'Code 128', writer: 'code128', reader: 'code_128_reader' },
    { type: 'code_39', name: 'Code 39', writer: 'code39', reader: 'code_39_reader' },
    { type: 'code_93', name: 'Code 93', writer: 'code93', reader: 'code_93_reader' },
    { type: 'ean_2', name: 'EAN 2', writer: 'ean2', reader: 'ean_2_reader' },
    { type: 'ean_5', name: 'EAN 5', writer: 'ean5', reader: 'ean_5_reader' },
    { type: 'ean_8', name: 'EAN 8', writer: 'ean8', reader: 'ean_8_reader' },
    { type: 'ean_13', name: 'EAN 13', writer: 'ean13', reader: 'ean_reader' },
    { type: 'i2of5', name: 'Interleaved 2 of 5', writer: 'interleaved2of5', reader: 'i2of5_reader' },
    { type: 'qrcode', name: 'QR Code', writer: 'qrcode', reader: null },
    { type: 'upc_e', name: 'UPC-E', writer: 'upce', reader: 'upc_e_reader' },
    { type: 'upc_a', name: 'UPC-A', writer: 'upca', reader: 'upc_reader' },
    { type: 'telepen', name: 'Telepen', writer: 'telepen', reader: 'telepen_reader' },
    { type: 'telepen_numeric', name: 'Telepen Numeric', writer: 'telepennumeric', reader: null }
];

export default class Barcode {
    type: string;
    name: string;
    reader: string;
    writer: string
}