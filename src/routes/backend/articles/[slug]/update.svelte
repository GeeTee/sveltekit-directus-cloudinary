<script>
 import ar from '$lib/stores/articlesStore'
 import {page} from '$app/stores'

 import EditArticle from '$lib/components/articles/EditArticle.svelte';

 const {slug} = $page.params  
 const item = $ar.filter(item => item.slug === slug)[0]
</script>
<section>
    <header>
        <h1 class="title has-text-warning">Update Un Article</h1>
    </header>
    <EditArticle itemToEdit={item} />
</section>