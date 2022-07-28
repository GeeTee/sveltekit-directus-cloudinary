<script>
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher();

    export let content = 'Mon content'

	let classBase = []
	// console.log($$restProps)
	for (const key in $$restProps) {
		if(!classBase.includes('key')) {
			classBase.push(key)
		}
	}
	// console.log({classBase})
	let classL = classBase.join(' ')
</script>
<div class="container">
    {@html content}
    <div class="actions">
        <span 
        class="has-text-info"
        on:click={() => dispatch('edit-elt')}
        >
            <i class="fas fa-pen-square"></i>
        </span>
        <span class="has-text-danger"><i class="fas fa-trash-alt"></i></span>
    </div>
</div>
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