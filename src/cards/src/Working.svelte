<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';
    import Quagga from '@ericblade/quagga2';
    import _ from 'underscore';
    import { BARCODES } from './back/Barcode';
    import  BarcodeResult from './back/BarcodeResult';

	const dispatch = createEventDispatcher();

	export let context: CardContext;

    function asciiToNumeric(ascii: string): string {
        let number = '';

        for(const n of ascii) {
            const temp = n.charCodeAt(0);
    
            if (temp >= 27) {
                number += temp - 27;
            }
            else {
                number += temp - 17;
            }
        }
    
        return number;
    }

    onMount(async () => {
        const readers = _
            .chain(BARCODES)
            .filter(x => x.reader)
            .map(x => x.reader)
            .value();

        const results: BarcodeResult[] = [];

        for (const reader of readers) {
            try {
                const result = await Quagga.decodeSingle({
                    src: context.croppedImage,
                    locate: false,
                    numOfWorkers: 0,
                    inputStream: {
                        size: 800,
                        singleChannel: false,
                    },
                    decoder : {
                        readers : [ reader ]
                    }
                });

                if (result.codeResult) {
                    results.push(new BarcodeResult(result.codeResult.format, result.codeResult.code));

                    if (result.codeResult.format == 'telepen')
                        results.push(new BarcodeResult('telepen_numeric', asciiToNumeric(result.codeResult.code)));
                }
            }
            catch(e) {
                console.log(e);
            }
        }

        const match = results.find(x => x.isMatch(context.number));

        context.scannedNumber = match?.code;
        context.type = BARCODES.find(x => x.type == match?.type);
        context.discovered = true;
        context.screen = match ? Screen.Name : Screen.Support;

        dispatch('next');
    });

</script>

<style>
    #progress {
        max-height: 150px;
    }
</style>

<div class="row">
    <div class="col">
        <div class="m-5 text-center">
            <p><img id="progress" src="/images/progress-anim.gif" alt="Working.." /></p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-5 text-center">
            <p>Please wait..</p>
        </div>
    </div>
</div>
