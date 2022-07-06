<script>
    import n from '$lib/stores/newsStore'
    import { getContext } from "svelte";
    import { goto } from '$app/navigation'

    import slugify from 'slugify'

    import f from '$lib/helpers/scripts'

    import TextInput from "../../UI/TextInput.svelte";
    import Button from "../../UI/Button.svelte";
    import ImagUpload from '$lib/partials/images/cld/ImageUploadCld.svelte'

    export let itemToEdit = undefined

    const directus = getContext('directus')
    const news = directus.items('test')

    let id = ''
    let title = ''
    let slug = '' //TODO: => ?????? 
    let redaction = ''
    let cld_public_id = ''
    let itemBup = {}
    // slugify 
    const options = {
        lower: true
    }

    const titleValid = true
    const redactionValid = true
    const croppingAspectRatio = 1.385

    $: formValid = titleValid && redactionValid

    let isEdited = false

    if (itemToEdit) {
        console.log('EditNews', {itemToEdit})
        isEdited = true
        itemBup = {...itemToEdit}
        id = itemToEdit.id
        title = itemToEdit.title
        slug = itemToEdit.slug
        redaction = itemToEdit.redaction
        cld_public_id = itemToEdit.cld_public_id
    }

    const saveItem = async (e) => {
        e.preventDefault()
        
        if (itemToEdit) {
            console.log('itemToEdit saveItem 1', {title}, {redaction})
            const updatedItem = {}
            // let imageToDelete = ''
            
            if (cld_public_id !== itemBup.cld_public_id) {
                updatedItem.cld_public_id = cld_public_id
                f.deleteOneImg(`Actibenne_banners_${itemBup.cld_public_id}`)
            }
            if (title !== itemBup.title) {
                updatedItem.title = title
                updatedItem.slug = slugify(title, options)
            }
            if (redaction !== itemBup.redaction) {
                updatedItem.redaction = redaction
            }
            console.log('itemToEdit saveItem 2', {updatedItem})
            n.updatePost(id, updatedItem)
            const res = await news.updateOne(id, updatedItem)
            console.log('itemToEdit saveItem 3', res)
            if (res) {
                goto(`/news/${updatedItem.slug || itemBup.slug}?img=${cld_public_id}`)
            }            
        }

        if (!itemToEdit) {
            console.log('createItem saveItem 1', {title}, {redaction})
            const createdItem = {}

            createdItem.cld_public_id = cld_public_id

            createdItem.title = title
            createdItem.slug = slugify(title, options)

            createdItem.redaction = redaction
            console.log('createItem saveItem 2', {createdItem})
            n.addPost(createdItem)
            const res = await news.createOne(createdItem)
            console.log('createItem saveItem 3', res)
            if (res.ok) {
                goto(`/news/${createdItem.slug}?img=${cld_public_id}`)
            }            
        }

    }
    const resetForm = (e) => {
        e.preventDefault()
        console.log('resetForm')
    }

    const getNewBannerId = (e) => {
        const {public_id} = e.detail
        console.log('getNewBannerId', public_id)
        const idArr = public_id.split('/')
        cld_public_id = idArr[idArr.length - 1]
        console.log('getNewBannerId', {cld_public_id})
    }
    const renewBannerId = (e) => {
        const {public_id} = e.detail
        console.log('renewBannerId', {public_id})
        const idArr = public_id.split('/')
        cld_public_id = idArr[idArr.length - 1]
        console.log('renewBannerId', {cld_public_id})
    }
</script>
<svelte:head>
<script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript">  
</script>
</svelte:head>
<div class="edit-news">
    <div class="banner-choice">
        <p class="label">Bannière</p>
        {#if cld_public_id}
            <ImagUpload 
            {cld_public_id} 
            {croppingAspectRatio} 
            imageInstalled={true}
            uploadPreset='Actibenne_banners' 
            dispatchTitle='renew-banner-id'
            on:renew-banner-id={renewBannerId}
            />
        {:else}
            <ImagUpload 
            buttonText='Choisir' 
            {croppingAspectRatio} 
            uploadPreset='Actibenne_banners' 
            dispatchTitle='get-new-banner-id'
            on:get-new-banner-id={getNewBannerId}
            />
        {/if}
        
    </div>
    <form>
        <TextInput
            id="title"
            label="Titre"
            type="text"
            valid={titleValid}
            validityMessage="Entrez votre Titre"
            controlType="input"
            value={title}
            on:input={event => (title = event.target.value)} />

        <TextInput
            id="redaction"
            label="Rédaction"
            valid={redactionValid}
            validityMessage="Entrez votre Titre"
            controlType="textarea"
            bind:value={redaction}
             />

        <div class="buttons">
            <Button
            is-success
            enabled={formValid}
            fct={saveItem}
            >
                Enregistrer
            </Button>
            {#if !itemToEdit}
                <Button
                is-warning
                enabled={formValid}
                fct={resetForm}
                >
                    Effacer
                </Button>
            {/if}

        </div>
    </form>
</div>

<style>
    .edit-news {
        max-width: 500px;
    }
</style>