<script context="module">
    import r from '$lib/helpers/req'
    export const load = async () => {
        const items = await r.getAllTest()
        return {
            props: {
                items
            }
        }
    }
</script>
<script>
    import n from '$lib/stores/newsStore'
    import {setContext} from 'svelte'
    export let items = []
    // console.log('news lay expected', {items})
    n.setNews(items)
</script>

<div class="container">
    <slot />
</div>