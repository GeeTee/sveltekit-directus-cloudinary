<script>
 import n from '$lib/stores/newsStore'
 import {page} from '$app/stores'

 import Banner from '$lib/partials/images/cld/BannerCld.svelte'

 const {slug} = $page.params  
 const item = $n.filter(item => item.slug === slug)[0]

 export let srcJpg = []
 export let srcWebP = []

//  export let srcTest = ''

</script>
<section>
    <header>
        <h1>Une news</h1>
    </header>
    <article>
        <header>
            <h2>{item?.title}</h2>
        </header>
        <div class="gt-banner">

            <Banner {srcJpg} {srcWebP} />

            <!-- <img src="https://res.cloudinary.com/geeteeimages/image/upload/c_scale,w_1500,q_auto,f_webp/Actibenne/banners/assainissement-par-actibenne" alt="test"> -->

            <!-- <img src={srcTest} alt="test"> -->

        </div> 
        <div class="content">
            {@html item?.redaction}
        </div>
    </article>
</section>