<script>
    import ar from '$lib/stores/articlesStore'
    import {page} from '$app/stores'

    const {slug} = $page.params 
    const item = $ar.filter(item => item.slug === slug)[0]
</script>
<article>
    <header>
        <h1 class="subtitle">{item?.title}</h1>
    </header>
    <div>
        <p>banner public_id : {item?.banner}</p>
    </div>
    <div class="content">
        {#if  item?.blocks.length > 0}
             {#each item?.blocks as block}
                 <ul>
                    <li>title : {block?.title}</li>
                    <li>html: {@html block?.text}</li>
                    <li>
                        image <ul>
                            <li>src: {block?.image}</li>
                            <li>width: {block?.image_width}</li>
                            <li>height: {block?.image_height}</li>
                            <li>position: {block?.image_position}</li>
                        </ul>
                    </li>
                    
                 </ul>
             {/each}
        {/if}
    </div>
    <div class="gallery">
        {#if item?.gallery !== null && item?.gallery?.length > 0}
             {#each item?.gallery as {public_id, width, height}}
                 <ul>
                    <li>public_id: {public_id}</li>
                    <li> width: {width}</li>
                    <li>height: {height}</li>
                 </ul>
             {/each}
        {/if}
    </div>
</article>