import Quagga from '@ericblade/quagga2';

export default class BarcodeService {
    readBarcode(image: Blob): Promise<string> {
        {
            return new Promise((resolve, reject) => {
                try {
                    const reader = new FileReader();
                    reader.readAsDataURL(image);
    
                    reader.onload = async (data) => {
                        const image = data.target.result.toString();
    
                        const result = await Quagga.decodeSingle({
                            src: image,
                            numOfWorkers: 0,
                            inputStream: {
                                size: 800,
                                singleChannel: false,
                            },
                            locator: {
                                halfSample: true,
                                patchSize: 'medium',
                            },
                            decoder: {
                                readers: ['ean_reader'],
                            },
                        });
    
                        let code = result.codeResult?.code;

                        if (!/^97[89][0-9]{10}$/.test(code)) {
                            code = null;
                        }

                        resolve(code);
                    };
                }
                catch(e) {
                    reject(e);
                }
            });
        }
    }
}
