<script lang="ts">
    import { Icon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'sveltestrap';
    import { createEventDispatcher } from 'svelte';
    import PwaInstaller from './back/pwa-installer';

    const dispatch = createEventDispatcher();

    let installed = PwaInstaller.isInstalled;
    PwaInstaller.addEventListener((isInstalled: boolean) => installed = isInstalled);

    export let colour = '#333';

    function installPwa() {
        PwaInstaller.install();
    }
</script>

<style>
    :global(#menu) {
        position: absolute;
        right: 20px;
        z-index: 1000;
        background-color: rgba(0, 0, 0, 0);
    }

    :global(#menu) > :global(button) {
        top: 15px;
        background-color: rgba(0,0,0,0);
        border: none;
        color: var(--menu-colour);
    }

    :global(#menu) > :global(button:focus) {
        border: none !important;
    }
</style>

<div style="--menu-colour: {colour}">
    <Dropdown id="menu" group size="sm">
        <DropdownToggle caret><Icon name="three-dots-vertical" /></DropdownToggle>
        <DropdownMenu end>
            <DropdownItem on:click={() => dispatch('my-libraries')}>My Libraries</DropdownItem>
            {#if !PwaInstaller.isStandalone && !installed}
                <DropdownItem on:click={() => installPwa()}>Install the App</DropdownItem>
            {/if}
            <DropdownItem divider />
            <DropdownItem on:click={() => dispatch('credits')}>About Libraree</DropdownItem>
        </DropdownMenu>
    </Dropdown>
</div>