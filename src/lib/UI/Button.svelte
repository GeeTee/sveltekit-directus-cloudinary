<script>
	export let enabled = false
	export let fct;
	
	let classBase = ["button"]
	// console.log($$restProps)
	for (const key in $$restProps) {
		if(!classBase.includes('key')) {
			classBase.push(key)
		}
	}
	// console.log({classBase})
	let classL = classBase.join(' ')
	// console.log({classL})
	// console.log(fct)
</script>
{#if fct}
<button 
class={classL} 
disabled={!enabled}
on:click={fct}
>
	<slot />
</button>
{:else}
<button 
class={classL} 
disabled={!enabled}
>
	<slot />
</button>
{/if}