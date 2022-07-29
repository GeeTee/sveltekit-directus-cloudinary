<script>
    import {createEventDispatcher} from 'svelte'
import AdvArticleContent from '../components/articles/AdvArticleContent.svelte';
import Block from './Block.svelte';

    const dispatch = createEventDispatcher();

    export let content = 'Mon content'

    export let type = 'html'

    export let component
    export let props = {}

</script>
{#if type === 'html'}
    <div class="container">
        {@html content}
        <div class="actions ml-3">
            <span 
            class="has-text-info"
            on:click={() => dispatch('edit-elt')}
            >
                <i class="fas fa-pen-square"></i>
            </span>
        </div>
    </div>
{/if}
{#if type === 'component'}
    <div class="container">
        <div>
            <svelte:component this={component} {...props} />
        </div>
        <div class="actions ml-3">
            <span 
            class="has-text-info"
            on:click={() => dispatch('edit-elt')}
            >
                <i class="fas fa-pen-square"></i>
            </span>
        </div>
    </div>
{/if}
<style lang="scss">
    .container {
        align-items: center;
        display: flex;
        justify-content: space-between;
    }
    .actions {
        display: flex;
        flex-direction: column;
    }
    i:hover {
        cursor: pointer;
    }
</style>