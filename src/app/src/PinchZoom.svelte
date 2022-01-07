<script lang="ts">
    import {
        Button,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader
    } from 'sveltestrap';
    
    import { createEventDispatcher } from 'svelte';

    export let state = {
        open: false,
        doNotShow: false
    };

    let doNotShow = state.doNotShow;

    const dispatch = createEventDispatcher();

    const toggle = () => {
        state.doNotShow = doNotShow;
        state.open = !state.open;
    };
</script>

<style>
    img {
        max-width: 95vw;
    }

    .text-right {
        text-align: right;
    }
</style>

<Modal isOpen={state.open && !state.doNotShow} {toggle} size="md" on:close={() => dispatch('close')}>
    <ModalHeader {toggle}>Barcode Scanning</ModalHeader>
    <ModalBody>
      <p>Use your camera to take a photo of a book's barcode.</p>
      <p>Pinch to zoom in to the barcode and get a sharp photo.</p>
      <p style="text-align: center"><img src="/images/pinch.png" alt="Pinch to zoom"></p>
    </ModalBody>
    <ModalFooter>
        <div class="container">
            <div class="row">
                <div class="col form-switch">
                    <label class="form-check-label p-2"><input type="checkbox" class="form-check-input" bind:checked={doNotShow}> Don't show this.</label>
                </div>
                <div class="col text-right">
                    <Button color="secondary" class="text-right" on:click={toggle}>Close</Button>
                </div>
            </div>
        </div>

    </ModalFooter>
  </Modal>