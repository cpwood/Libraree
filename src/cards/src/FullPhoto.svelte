<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type CardContext from './back/CardContext';
    import { Screen } from './back/Screens';
    import { Icon } from 'sveltestrap';

	const dispatch = createEventDispatcher();

	export let context: CardContext;
    let  fileinput;
	
	const onFileSelected =(e)=>{
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        
        reader.onload = data => {
            context.image = data.target.result.toString();
            context.screen = Screen.ZoomCrop;
            dispatch('next');
        };
    };

</script>

<style>
    img {
        max-width: 250px;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    ul li:before {
        content: '✓  ';
        color: green;
    }

    #fileinput {
        display: none;
    }
</style>

<div class="row">
    <div class="col">
        <div class="m-5">
            <p>Now take or choose a photo of your library card. Again, it won't leave your phone.</p>

            <p class="text-center">
                <img src="/images/Card-Full.png" alt="Example card" />
            </p>
            
            <ul>
                <li>Get as close to your card as possible without things getting blurry.</li>
                <li>If the photo becomes blurry, move your phone further away from your card.</li>
                <li>Try to use light from a window and avoid shadows.</li>
            </ul>

        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="text-center">
            <button class="btn btn-success" on:click={() => fileinput.click()}><Icon name="camera-fill" /> Take or Choose a Photo</button>
            <input id="fileinput" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} />
        </div>
    </div>
</div>
