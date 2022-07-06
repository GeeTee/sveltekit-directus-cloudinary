
<script>
    import n from '$lib/stores/newsStore'
    import {getContext} from 'svelte'
    import Banner from '$lib/partials/images/cld/BannerSquare300Cld.svelte'

    const cldPath = getContext('cldPath')
</script>
<h1>Liste de news</h1>
{#if $n.length > 0}
    <div>
        {#each $n as {title, id, slug, cld_public_id} (id)}
            <div>
                <div>
                    <Banner idBanner={`${cldPath}/${cld_public_id}`} />
                </div>
                <a sveltekit:prefetch href="news/{slug}?img={cld_public_id}" {title}>{title} &raquo;</a>
            </div>
        {/each}
    </div>
{/if}