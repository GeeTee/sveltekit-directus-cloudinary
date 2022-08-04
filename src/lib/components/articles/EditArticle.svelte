<script>
    import ar from '$lib/stores/articlesStore'
    import { writable } from 'svelte/store'
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
    import Indication from '../../UI/LabelIndication.svelte'

    export let itemToEdit = undefined

    const directus = getContext('directus')
    const articles = directus.items('advanced_articles')

    let parts = writable([])

    let id = ''
    let title = ''
    let slug = '' //TODO: => ?????? 
    let main_text = ''
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

    // VALIDATIONS DE CHAMPS
    const redactionValid = true
    const croppingAspectRatio = 1.385
    let mainTextValid = true

    $: formValid = titleValid && redactionValid

    let editTitle = false
    let editBanner = false
    let editMainText = false
    let editGallery = false
    let galleryAction = ''
    let blockIsUpdated = false

    // LOADING STATES BUTTONS 
    let isLoadingSaveMainTextButton = false

    if (itemToEdit) {
        console.log('EditNews', {itemToEdit})
        // isEdited = true
        itemBup = {...itemToEdit}
        id = itemToEdit.id
        title = itemToEdit.title
        slug = itemToEdit.slug
        main_text = itemToEdit.main_text
        if (itemToEdit.blocks) {
            blocks = itemToEdit.blocks
            parts.set(itemToEdit.blocks)        
        }
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

    // $: console.log('EditArticle', {blocks})

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

            if (main_text !== itemBup.main_text) {
                updatedItem.main_text = main_text
            }

            if (blockIsUpdated) {
                updatedItem.blocks = blocks
                console.log('saveItem BBlocks', 'blocks.l :', blocks?.length, '<br />updatedItem.blocks.l :', updatedItem.blocks?.length, '<br />itemToEdit.blocks.l :',  itemToEdit.blocks?.length)
                console.log('saveItem blocks', {blocks})
            }

            //TODO: Manage gallery
            updatedItem.gallery_photos = gallery_photos
            if (updatedItem.gallery_photos.length > 0) {
                console.log('updatedItem.gallery_photos : ', updatedItem.gallery_photos)
                updatedItem.gallery_photos.forEach(elt => {
                    imgsKept = f.deleteOneEltFromArray(imgsKept, f.slashToUnderscore(elt.public_id))
                    imgsToDelete = [...imgsKept]
                });
                thumbGallProps.thumbGallery = thumbGallery
            }
            if (updatedItem.gallery_photos.length === 0 && imgsKept.length > 0) {
                imgsToDelete = [...imgsKept]
            }

            console.log('itemToEdit saveItem 2', {updatedItem})
                        
            const res = await articles.updateOne(id, updatedItem)
            console.log('itemToEdit saveItem 3', res)
            haveSaved = true

            if (res) {
                ar.updateArticle(id, updatedItem)
                console.log('RRRR', $ar)
                // goto(`/news/${updatedItem.slug || itemBup.slug}?img=${cld_public_id}`)
            }            
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

    //MAIN TEXT
    const editingMainText = () => {
        console.log('editingMainText')
        editMainText = true
    }
    const saveNewMainText = async () => {
        console.log('saveNewMainText')
        isLoadingSaveMainTextButton = true
        await saveItem()
        editMainText = false
    }
    const cancelModifMainText = () => {
        console.log('cancelModifMainText')
        main_text = itemBup.main_text
        editMainText = false
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
        console.log('getGalleryInfo adding', {imgsKept}, {gallery_photos})
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
        const thumbsGallSlugRef = await itemBup.gallery_photos.map(img => {
            return f.slashToUnderscore(img.public_id)
        })
        if (galleryAction === 'removing') {
            console.log('cancelModifGallery removing 1', {imgsKept}, {thumbsGallSlugRef})

            await thumbsGallSlugRef.forEach(slug => {
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
            console.log('cancelModifGallery removing 2', {imgsKept}, {thumbsGallSlugRef}, {thumbGallery})
        }
        // ADDING => QUAND ON QUITTE LA PAGE, ELLE(S) EST / SONT ENLEVÉES

        editGallery = false
    }

    // BLOCKS
    const updateBlock = (e) => {
        const {blockWithChanges} = e.detail
        console.log('updateBlock EditArticle 1', {blockWithChanges})
        const {id} = blockWithChanges
        let idx = blocks.findIndex(item => item.id === id)

        // const keys = ['title', 'text']
        // const l = keys.length

        // for (let i = 0; i < l; i++) {
        //     if (blocks[idx][keys[i]]) { // ON A UN TITLE
        //     if (blockWithChanges[keys[i]]) { // ON A UN NOUVEAU TITLE 
        //         if (blocks[idx][keys[i]] !== blockWithChanges[keys[i]]) { // TITLES DIFFÉRENTS
        //             blocks[idx][keys[i]] = blockWithChanges[keys[i]]
        //         }
        //     }
        //         // PAS DE NOUVEAU TITLE
        //         delete blocks[idx][keys[i]]
        //     }

        //     if (!blocks[idx][keys[i]]) { // PAS DE TITLE ON EN AJOUTE UN
        //         if (blockWithChanges[keys[i]]) {
        //             blocks[idx][keys[i]] = blockWithChanges.title
        //         }        
        //     }
        // }

        // MANAGING TITLE
        if (blocks[idx].title) { // ON A UN TITLE
            if (blockWithChanges.title) { // ON A UN NOUVEAU TITLE 
                if (blocks[idx].title !== blockWithChanges.title) { // TITLES DIFFÉRENTS
                    blocks[idx].title = blockWithChanges.title
                }
            }
            // PAS DE NOUVEAU TITLE
            delete blocks[idx].title
        }

        if (!blocks[idx].title) { // PAS DE TITLE ON EN AJOUTE UN
            if (blockWithChanges.title) {
                blocks[idx].title = blockWithChanges.title
            }        
        }

        // MANAGING TEXT
        if (blocks[idx].text) { // ON A UN TEXT
            if (blockWithChanges.text) { // ON A UN NOUVEAU TEXT 
                if (blocks[idx].text !== blockWithChanges.text) { // TEXTS DIFFÉRENTS
                    blocks[idx].text = blockWithChanges.text
                }
            }
            // PAS DE NOUVEAU TEXT
            delete blocks[idx].text
        }

        if (!blocks[idx].text) { // PAS DE TEXT ON EN AJOUTE UN
            if (blockWithChanges.text) {
                blocks[idx].text = blockWithChanges.text
            }        
        }

        // MANAGING IMAGE
        if (blocks[idx].image) { // ON A UN IMAGE
            if (blockWithChanges.image) { // ON A UN NOUVEAU IMAGE 
                if (blocks[idx].image !== blockWithChanges.image) { // IMAGES DIFFÉRENTS
                    blocks[idx].image = blockWithChanges.image
                    blocks[idx].image_width = blockWithChanges.image_width
                    blocks[idx].image_height = blockWithChanges.image_height
                    blocks[idx].image_position = blockWithChanges.image_position
                }
            }
            // PAS DE NOUVEAU IMAGE
            delete blocks[idx].image
            delete blocks[idx].image_width
            delete blocks[idx].image_height
            delete blocks[idx].image_position
        }

        if (!blocks[idx].image) { // PAS DE IMAGE ON EN AJOUTE UN
            if (blockWithChanges.image) {
                blocks[idx].image = blockWithChanges.image
                blocks[idx].image_width = blockWithChanges.image_width
                blocks[idx].image_height = blockWithChanges.image_height
                blocks[idx].image_position = blockWithChanges.image_position
            }        
        }

        // blocks[idx] = blockUpdated
        console.log('updateBlock EditArticle 2', {blocks}, idx, id)
        parts.set([])
        parts.set(blocks)
        blockIsUpdated = true
        saveItem()
    }
    const saveNewBlock = (e) => {
        const {blockCreated} = e.detail
        console.log('saveNewBlock EditArticle 1', {blockCreated})
        blocks.push(blockCreated)
        parts.set([])
        parts.set(blocks)
        console.log('saveNewBlock EditArticle 1O', {blocks}, {parts})
        blockIsUpdated = true
        saveItem()
        
    }
    const deletingBlock = (e) => {
        const {id} = e.detail
        console.log('deletingBlock', {id})
        blocks = blocks.filter(item => item.id !== id)
        parts.set([])
        parts.set(blocks)
        blockIsUpdated = true
        saveItem()
    }

    onDestroy(
        () => {
            parts.set([])
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

<div class="edit-news has-background-white-ter p-3 block">

    {#if editTitle}
    <div class="has-background-grey-light p-2">
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
            is-primary
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
    </div>
    {/if}
    {#if !editTitle}
    <Indication 
    has-background-dark
    is-size-6
    has-text-success
    indication="Titre de l'article" 
    />
        <Html 
        content={`<span class="title">${title}</span>`} 
        on:edit-elt={editingTitle}
        />
    {/if}

    {#if editBanner}
    <div class="has-background-grey-light p-2">
        <p class="label">Bannière</p>
        {#if cld_public_id}
            <ImagUpload 
            {cld_public_id} 
            {croppingAspectRatio} 
            isOutlined={true}
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
            isOutlined={true}
            text={`Pensez à enregistrer le choix de votre photo. <br />Bouton jaune ci dessous :  "Enregistrer la modif"`}
            uploadPreset='Actibenne_banners' 
            dispatchTitle='get-new-banner-id'
            on:get-new-banner-id={getNewBannerId}
            />
        {/if}
            <Button
            is-danger
            is-outlined
            block
            enabled={deleteBannerValid}
            fct={deletingBanner}
            >
                Détruire
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
    <Indication 
    has-background-dark
    is-size-6
    has-text-success
    indication="Bannière" 
    />
         <Html 
        content={`<div class="edit-banner block">
                    <img src=${f.bannerResizeW(500, cld_public_id)} alt="">
                </div>`} 
        on:edit-elt={editingBanner}
        />
    {/if}

    {#if !editMainText}
    <Indication 
    has-background-dark
    is-size-6
    has-text-success
    indication="Rédactionnel principal et indispensable" 
    />
        <Html 
        content={`<div>${main_text}</div>`} 
        on:edit-elt={editingMainText}
        />
    {/if}

    {#if editMainText}
    <div class="has-background-grey-light p-2">
        <TextInput
            id="main-redaction"
            label="Rédaction principale"
            validityMessage="Entrez votre rédactionnel"
            controlType="textarea"
            bind:value={main_text}
            />
        {#if main_text === ''}
             <span class="has-text-danger">Vous ne pouvez pas effacer le rédactionnel principal de l'article => abandonner la modif</span>
        {/if}
        <div class="buttons">
            <Button
            is-primary
            isLoading={isLoadingSaveMainTextButton}
            enabled={mainTextValid}
            fct={saveNewMainText}
            >
                Enregistrer la modif
            </Button>
            <Button
            is-info
            enabled={true}
            fct={cancelModifMainText}
            >
                Abandonner la modif
            </Button>
        </div>
    </div>
    {/if}

    {#if $parts.length > 0}
    {$parts.length} <br>
        <Indication 
        has-background-dark
        is-size-6
        has-text-success
        indication="Les blocks de rédactions en place" 
        />
        {#each $parts as block}
                <Block 
                {block} 
                updateBlock={true}
                on:update-block={updateBlock}
                on:deleting-block={deletingBlock}
                />
        {/each}
    {/if}
    <div>
        <Indication 
        has-background-dark
        is-size-6
        has-text-success
        indication="Ajouter un / des block(s)" 
        />
        <Block
        updateBlock={true} 
        creatingBlock={true}
        on:save-new-block={saveNewBlock}
        />
    </div>

    {#if editGallery}
    <div class="has-background-grey-light p-2">
    <GallUpload 
    {thumbGallery}
    isOutlined={true}
    showAdvancedOptions={false}
    uploadPreset='Actibenne_postsGalleries'
    dn={dnGallery}
    on:get-gallery-info={getGalleryInfo}
    on:deleting-Imgs={deletingImgs}
    on:empty-gallery={emptyGallery}
    />
    <div class="buttons">
        <Button
        is-primary
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
    </div>
    {/if}
    {#if !editGallery}
        <Indication 
        has-background-dark
        is-size-6
        has-text-success
        indication="Galerie images" 
        />
        <Html 
        type='component'
        component={thumbGallCompo}
        props={thumbGallProps}
        on:edit-elt={editingGallery}
        />
    {/if}
</div>



<style>
    .edit-news {
        max-width: 500px;
    }
</style>