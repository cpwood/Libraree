<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';
    import Cropper from 'svelte-easy-crop';

	const dispatch = createEventDispatcher();

	export let context: CardContext;

    let width = 0;
    let height = 0;
    let cropX = 0;
    let cropY = 0;
    let cropWidth = 0;
    let cropHeight = 0;
    let canvas: HTMLCanvasElement;
    let container: HTMLDivElement;

    function onCrop(detail) {
        cropX = detail.x;
        cropY = detail.y;
        cropWidth = detail.width;
        cropHeight = detail.height;
    }

    async function next() {
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        const ctx = canvas.getContext('2d');
        const image = container.getElementsByTagName('div')[0].getElementsByTagName('img')[0];
        ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        context.croppedImage = canvas.toDataURL();
        context.screen = Screen.Working;
        dispatch('next');
    }

</script>

<style>
    img {
        max-width: 250px;
    }

    canvas {
        display: none;
    }
    
    #crop-container {
        position: relative;
        height: 250px;
    }

    :global(.cropperArea::after) {
        content: ' ';
        box-sizing: border-box;
        border: 5px solid rgb(151, 255, 60) !important;
        position: absolute;
        top: 50%;
        bottom: 50%;
        left: 0;
        right: 0;
        border-left: 0;
        border-right: 0;
    }
</style>

<div class="row">
    <div class="col">
        <div class="m-2">
            <p>Move and zoom the photo so your barcode fills as much of the box as possible, and ensure the green line passes through the full width of it.</p>
            <p class="text-center">
                <img src="/images/Card-ZoomCrop.png" alt="Example card" />
            </p>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div id="crop-container" bind:this={container} class="m-3" bind:clientWidth={width} bind:clientHeight={height}>
            <Cropper
                image={context.image}
                crop={{ x: 0, y: 0 }}
                zoom={2}
                aspect={17/6}
                maxZoom={8}
                showGrid={false}
                cropSize={{
                    height: height - 20,
                    width: width - 20
                }}
                on:cropcomplete={e => onCrop(e.detail.pixels)}
                />
        </div>
        <p>On a phone or tablet, you can use a single finger to move the image and two fingers to zoom.</p>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="m-5 text-center">
            <button class="btn btn-success" on:click={() => next()}>Next</button>
        </div>
    </div>
</div>
<canvas bind:this={canvas}></canvas>