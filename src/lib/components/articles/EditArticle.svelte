<script>
    import ar from '$lib/stores/articlesStore'
    import { getContext, onDestroy } from "svelte";
    import { goto } from '$app/navigation'

    import slugify from 'slugify'

    import f from '$lib/helpers/scripts'

    import TextInput from "../../UI/TextInput.svelte";
    import Html from "../../UI/EditableHtml.svelte";
    import Block from "../../UI/Block.svelte";
    import ImagUpload from '$lib/partials/images/cld/ImageUploadCld.svelte'
    import GallUpload from '$lib/partials/images/cld/GalleryImgsUploadCld.svelte'
    import ThumbsGallery from '../../partials/images/ThumbsGallery.svelte'
    import Button from '../../UI/Button.svelte'

    export let itemToEdit = undefined

    const directus = getContext('directus')
    const articles = directus.items('advanced_articles')

    let id = ''
    let title = ''
    let slug = '' //TODO: => ?????? 
    let cld_public_id = ''
    let blocks = []
    let gallery_photos = []
    let thumbGallery= []
    let itemBup = {}
    let imgsKept = []
    let imgsToDelete = []
    // slugify 
    const options = {
        lower: true
    }

    // CONFIRMATION ACTION ENREGISTER //TODO:
    let haveSaved = false
    let showWarningLeavingPage = false
    // -- activation des notifications pour enregistrer les changement d'imgs
    let dnBanner = true
    let dnGallery = true

    // const titleValid = true
    const redactionValid = true
    const croppingAspectRatio = 1.385

    $: formValid = titleValid && redactionValid

    let editTitle = false
    let editBanner = false
    let editGallery = false
    let galleryAction = ''

    if (itemToEdit) {
        console.log('EditNews', {itemToEdit})
        // isEdited = true
        itemBup = {...itemToEdit}
        id = itemToEdit.id
        title = itemToEdit.title
        slug = itemToEdit.slug
        blocks = itemToEdit.blocks
        cld_public_id = itemToEdit.cld_public_id // BAnner
        if (itemToEdit.gallery_photos !== null) {
            gallery_photos = itemToEdit.gallery_photos
            thumbGallery = gallery_photos.map(img => {
                return {
                    slug: f.slashToUnderscore(img.public_id),
                    public_id: img.public_id
                }
            })
        }
        
    }

    $: console.log('EditArticle', {blocks})

    const saveItem = async () => {
        if (itemToEdit) {
            console.log('itemToEdit saveItem 1', {title})
            const updatedItem = {}
            // let imageToDelete = ''
            
            if (cld_public_id !== itemBup.cld_public_id) {
                // on enlève la banner
                if (cld_public_id === '') {
                    f.deleteOneImg(f.slashToUnderscore(itemBup.cld_public_id))
                    itemBup.cld_public_id = ''
                }

                updatedItem.cld_public_id = cld_public_id
                imgsKept = f.deleteOneEltFromArray(imgsKept, f.slashToUnderscore(cld_public_id))
                imgsToDelete = [...imgsKept]
                f.deleteOneImg(f.slashToUnderscore(itemBup.cld_public_id))
            }
            if (title !== itemBup.title) {
                updatedItem.title = title
                updatedItem.slug = slugify(title, options)
            }


            //TODO: Manage gallery
            updatedItem.gallery_photos = gallery_photos
            if (updatedItem.gallery_photos.length > 0) {
                console.log('updatedItem.gallery_photos : ', updatedItem.gallery_photos)
                updatedItem.gallery_photos.forEach(elt => {
                    imgsKept = f.deleteOneEltFromArray(imgsKept, f.slashToUnderscore(elt.public_id))
                    imgsToDelete = [...imgsKept]
                });
            }
            if (updatedItem.gallery_photos.length === 0 && imgsKept.length > 0) {
                imgsToDelete = [...imgsKept]
            }

            console.log('itemToEdit saveItem 2', {updatedItem})
            ar.updateArticle(id, updatedItem)
            const res = await articles.updateOne(id, updatedItem)
            console.log('itemToEdit saveItem 3', res)
            haveSaved = true

            // if (res) {
            //     goto(`/news/${updatedItem.slug || itemBup.slug}?img=${cld_public_id}`)
            // }            
        }

        if (!itemToEdit) {
            console.log('createItem saveItem 1', {cld_public_id}, {title}, {redaction})
            const createdItem = {}

            createdItem.cld_public_id = cld_public_id
            imgsKept = f.deleteOneEltFromArray(imgsKept, f.slashToUnderscore(cld_public_id))
            console.log('saveItem', {imgsKept})

            createdItem.title = title
            createdItem.slug = slugify(title, options)



            createdItem.gallery_photos = gallery_photos

            console.log('createItem saveItem 2', {createdItem})
            n.addPost(createdItem)
            const res = await news.createOne(createdItem)
            console.log('createItem saveItem 3', res)
            haveSaved = true
            if (res) {
                goto(`/news/${createdItem.slug}?img=${cld_public_id}`)
            }            
        }

    }
    const resetForm = (e) => {
        e.preventDefault()
        console.log('resetForm')
    }

    // BANNER
    $: bannerValid = (cld_public_id !== itemBup.cld_public_id)? true : false
    $: deleteBannerValid = (cld_public_id !== '')? true : false
    const getNewBannerId = (e) => {
        const {public_id} = e.detail
        console.log('getNewBannerId', public_id)
        imgsKept.push(f.slashToUnderscore(public_id))
        console.log('getNewBannerId', {imgsKept})
        cld_public_id = public_id
        console.log('getNewBannerId', {cld_public_id})
    }
    const renewBannerId = (e) => {
        const {public_id} = e.detail
        console.log('renewBannerId', {public_id})
        imgsKept.push(f.slashToUnderscore(public_id))
        console.log('renewBannerId', {imgsKept})
        cld_public_id = public_id
        console.log('renewBannerId', {cld_public_id})
        dnBanner = false
    }
    const saveNewBanner = async () => {
        await saveItem()
        editBanner = false        
    }
    const editingBanner = () => {
        editBanner = true
    }
    const deletingBanner = () => {
        cld_public_id = ''
    }
    const cancelModifBanner = () => {
        cld_public_id = itemBup.cld_public_id
        editBanner = false
    }

    // TITLE
    $: titleValid = (title !== itemBup.title && title !== '') ? true : false
    const editingTitle = () => {
        editTitle = true
    }
    const saveNewTitle = async () => {
        await saveItem()
        editTitle = false
    }
    const cancelModifTitle = () => {
        title = itemBup.title
        editTitle = false
    }

    // GALLERY IMGS
    let thumbGallCompo = ThumbsGallery
    let thumbGallProps = {
        thumbGallery,
    }
    const getGalleryInfo = (e) => {
        const cldArray = e.detail 
        console.log('getGalleryInfo', cldArray)
        if (itemToEdit) {
            dnGallery = false
        }
        cldArray.forEach(elt => {
            const slug = f.slashToUnderscore(elt.uploadInfo.public_id)
            imgsKept.push(slug)
            gallery_photos = [
                ...gallery_photos,
                {
                    public_id: elt.uploadInfo.public_id,
                    height: elt.uploadInfo.height,
                    width: elt.uploadInfo.width
                }
            ]
            thumbGallery = [
                ...thumbGallery,
                {
                    slug,
                    public_id: elt.uploadInfo.public_id,
                }
            ]
        });
        galleryAction = 'adding'
        console.log('getGalleryInfo', {imgsKept}, {gallery_photos})
    }
    const deletingImgs = (e) => {
        let {public_id, slug} = e.detail
        console.log('EditArticle deletingImgs', {public_id, slug})
        imgsKept.push(slug)
        thumbGallery = thumbGallery.filter(item => item.public_id !== public_id)
        gallery_photos = gallery_photos.filter(item => item.public_id !== public_id)
        dnGallery = false
        galleryAction = 'removing'
    }
    const emptyGallery = () => {
        console.log('EditArticle emptyGallery 1', {imgsKept})
        imgsKept = thumbGallery.map(img => {return img.slug})
        console.log('EditArticle emptyGallery 2', {imgsKept})
        thumbGallery = []
        gallery_photos = []
        dnGallery = false
    }
    const editingGallery = () => {
        editGallery = true
    }
    const saveNewGallery = async () => {
        await saveItem()
        editGallery = false
    }
    const cancelModifGallery = async () => {
        if (galleryAction === 'removing') {
            const thumbGallSlug = await itemBup.gallery_photos.map(img => {
                return f.slashToUnderscore(img.public_id)
            })
            console.log('cancelModifGallery removing 1', {imgsKept}, {thumbGallSlug})

            await thumbGallSlug.forEach(slug => {
                if (imgsKept.includes(slug)) {
                    imgsKept = imgsKept.filter(item => item !== slug)
                }
            });
            thumbGallery = []
            thumbGallery = itemBup.gallery_photos.map(img => {
                return {
                    slug: f.slashToUnderscore(img.public_id),
                    public_id: img.public_id
                }
            })
            console.log('cancelModifGallery removing 2', {imgsKept}, {thumbGallSlug}, {thumbGallery})
        }
        // imgsKept = []
        if (galleryAction === 'adding') {
            console.log('cancelModifGallery adding 1', {imgsKept})
        }

        editGallery = false
    }

    // BLOCKS
    const updateBlock = (e) => {
        const {blockWithChanges} = e.detail
        console.log('updateBlock', {blockWithChanges})
        const {id} = blockWithChanges
        let idx = blocks.findIndex(item => item.id === id)
        const blockUpdated = {
            ...blocks[idx],
            ...blockWithChanges
        }
        blocks[idx] = blockUpdated
        console.log('updateBlock', {blocks}, idx, id)
    }

    onDestroy(
        () => {
            if (!haveSaved) {
                showWarningLeavingPage = true
                console.log('ONDESTROY na pas sauvegardé', {showWarningLeavingPage})
                imgsToDelete = [...imgsKept]
            }
            if (haveSaved) {
                console.log('ONDESTROY a sauvegardé', {showWarningLeavingPage})
            }
            console.log('ONDESTROY', {imgsToDelete})
            if (imgsToDelete.length > 0) {
                f.deleteAllImgsFromArray(imgsToDelete)
            }
        }
    )
</script>
<svelte:head>
<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript">  
</script>
</svelte:head>
{#if itemToEdit}
<div class="edit-news has-background-white-ter p-3 block">
    {#if editBanner}
    <div class="banner-choice">
        <p class="label">Bannière</p>
        {#if cld_public_id}
            <ImagUpload 
            {cld_public_id} 
            {croppingAspectRatio} 
            text={`Pensez à enregistrer le choix de votre photo. <br />Bouton jaune ci dessous :  "Enregistrer la modif"`}
            imageInstalled={true}
            uploadPreset='Actibenne_banners' 
            dispatchTitle='renew-banner-id'
            dn={dnBanner}
            on:renew-banner-id={renewBannerId}
            />
        {:else}
            <ImagUpload 
            buttonText='Choisir' 
            {croppingAspectRatio} 
            text={`Pensez à enregistrer le choix de votre photo. <br />Bouton jaune ci dessous :  "Enregistrer la modif"`}
            uploadPreset='Actibenne_banners' 
            dispatchTitle='get-new-banner-id'
            on:get-new-banner-id={getNewBannerId}
            />
        {/if}
            <Button
            is-danger
            enabled={deleteBannerValid}
            fct={deletingBanner}
            >
                Enlever la bannière
            </Button>
        <div class="buttons">
            <Button
            is-warning
            enabled={bannerValid}
            fct={saveNewBanner}
            >
                Enregistrer la modif
            </Button>
            <Button
            is-info
            enabled={true}
            fct={cancelModifBanner}
            >
                Abandonner la modif
            </Button>
        </div>       
    </div>
    {/if}
    {#if !editBanner}
         <Html 
        content={`<div class="edit-banner block">
                    <img src=${f.bannerResizeW(500, cld_public_id)} alt="">
                </div>`} 
        on:edit-elt={editingBanner}
        />
    {/if}
    {#if editTitle}
        <TextInput
            id="title"
            label="Titre"
            type="text"
            valid={titleValid}
            validityMessage="Entrez votre Titre"
            controlType="input"
            value={title}
            on:input={event => (title = event.target.value)} />
        {#if title === ''}
             <span class="has-text-danger">Vous ne pouvez pas effacer le titre de l'article => abandonner la modif</span>
        {/if}
        <div class="buttons">
            <Button
            is-warning
            enabled={titleValid}
            fct={saveNewTitle}
            >
                Enregistrer la modif
            </Button>
            <Button
            is-info
            enabled={true}
            fct={cancelModifTitle}
            >
                Abandonner la modif
            </Button>
        </div>
    {/if}
    {#if !editTitle}
        <Html 
        content={`<span class="title">${title}</span>`} 
        on:edit-elt={editingTitle}
        />
    {/if}


    {#if blocks.length > 0}
        {#each blocks as block}
                <Block 
                {block} 
                on:update-block={updateBlock}
                />
        {/each}
    {/if}

    {#if editGallery}
    <GallUpload 
    {thumbGallery}
    showAdvancedOptions={false}
    uploadPreset='Actibenne_postsGalleries'
    dn={dnGallery}
    on:get-gallery-info={getGalleryInfo}
    on:deleting-Imgs={deletingImgs}
    on:empty-gallery={emptyGallery}
    />
    <div class="buttons">
        <Button
        is-warning
        enabled={true}
        fct={saveNewGallery}
        >
            Enregistrer la modif
        </Button>
        <Button
        is-info
        enabled={true}
        fct={cancelModifGallery}
        >
            Abandonner la modif
        </Button>
    </div>
    {/if}
    {#if !editGallery}
        <Html 
        type='component'
        component={thumbGallCompo}
        props={thumbGallProps}
        on:edit-elt={editingGallery}
        />

    {/if}
</div>

{/if}

<style>
    .edit-news {
        max-width: 500px;
    }
</style>