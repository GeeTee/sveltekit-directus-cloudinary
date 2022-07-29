<script>
    import {createEventDispatcher} from 'svelte'
    import f from '$lib/helpers/scripts'
    import TextInput from '$lib/UI/TextInput.svelte'
    import Button from '$lib/UI/Button.svelte'
    import ImagUpload from '$lib/partials/images/cld/ImageUploadCld.svelte'
    import Content from '$lib/components/articles/BlockContent.svelte'

    const dispatch = createEventDispatcher();

    export let block = {}

    export let updateBlock = false
    let isEdited = false
    const blockBup = {...block}
    let {id,title, text, image, image_width, image_height, image_position} = block

    const croppingAspectRatio = 1
    let dnBanner = true

    if (!title) {
        title = ''
    }
    if (!text) {
        text = ''
    }
    // if (!image) {
    //     image = ''
    // }
    $: console.log('block', {id}, {title}, {text})

    const renewIllustrationId = (e) => {
        image = e.detail.public_id
        console.log('renewIllustrationId', {image})
    }

    const getNewIllustrationId = (e) => {
        image = e.detail.public_id
        console.log('getNewIllustrationId', {image})
        //TODO:
    }

    const deleteIllustration = () => {
        image = ''
        console.log('deleteIllustration image : ', {image})
    }

    const saveBlock = () => {
        console.log(('saveBlock'), {id})
        const blockWithChanges = {
            id,
        }
        if (title !== blockBup.title) {
            blockWithChanges.title = title
        }
        if (text !== blockBup.text) {
            blockWithChanges.text = text
        }
        console.log('saveBlock point img', {image}, blockBup.image)
        if (image === '' && blockBup.image !== '') { 
            console.log('on a enlevé l image et on confirme donc la supprimme', {image})
            f.deleteOneImg(f.slashToUnderscore(blockBup.image))
            blockWithChanges.image = image
            blockWithChanges.image_width = image_width
            blockWithChanges.image_height = image_height
            blockWithChanges.image_position = image_position
        }
        if ( image !== '' && image !== blockBup.image) { 
            console.log('on a changé l image et on confirme donc détruite le bup',{image} )
            f.deleteOneImg(f.slashToUnderscore(blockBup.image))
            blockWithChanges.image = image
            blockWithChanges.image_width = image_width
            blockWithChanges.image_height = image_height
            blockWithChanges.image_position = image_position
        }
        if ( image !== '' && blockBup.image === '') { 
            console.log('on ajoute une image, il n y en avait pas',{image} )
            blockWithChanges.image = image
            blockWithChanges.image_width = 800
            blockWithChanges.image_height = 800
            blockWithChanges.image_position = 'right'
        }
        console.log(('saveBlock'), {blockWithChanges})

        dispatch('update-block', {blockWithChanges})
        isEdited = false
    }

    const cancelModifBlock = () => {
        title = blockBup.title
        text = blockBup.text
        image = blockBup.image
        image_width = blockBup.image_width
        image_height = blockBup.image_height
        image_position = blockBup.image_position
        console.log('cancelModifBlock', {block})
        isEdited = false
    }
</script>

{#if updateBlock}
    {#if isEdited}
        <div class="has-background-warning-light block">
            <p>id: {id}</p>
            <TextInput
                id="subtitle"
                label="Titre du blcok"
                type="text"
                validityMessage="Entrez votre Titre"
                controlType="input"
                bind:value={title}
                on:input={event => (title = event.target.value)} />

            <TextInput
                id="redaction"
                label="Rédaction"
                validityMessage="Entrez votre Titre"
                controlType="textarea"
                bind:value={text}
                />

            {#if image}
                <ImagUpload 
                cld_public_id={image} 
                {croppingAspectRatio} 
                buttonText='Remplacer'
                imageInstalled={true} 
                showDeleteImg={true}
                uploadPreset='Actibenne_illustrations' 
                dispatchTitle='renew-illustration-id'
                dn={dnBanner}
                imgResize={f.imgSquareW}
                w=200
                on:renew-illustration-id={renewIllustrationId}
                on:delete-img={deleteIllustration}
                />
            {:else}
                <ImagUpload 
                buttonText='Choisir' 
                {croppingAspectRatio}
                uploadPreset='Actibenne_illustrations' 
                dispatchTitle='get-new-illustration-id'
                on:get-new-illustration-id={getNewIllustrationId}
                />
            {/if}
            <div class="buttons">
                <Button
                is-warning
                enabled={true}
                fct={saveBlock}
                >
                    Enregistrer la modif
                </Button>
                <Button
                is-info
                enabled={true}
                fct={cancelModifBlock}
                >
                    Fermer / Abandonner
                </Button>
            </div>
        </div>
    {/if}
    {#if !isEdited}
        
    <div class="container">
        <div>
            <Content {block} />
        </div>
        <div class="actions ml-3">
            <span 
            class="has-text-info"
            on:click={() => {
                isEdited = true
                console.log('open block', {block})
            }}
            >
                <i class="fas fa-pen-square"></i>
            </span>
        </div>
    </div>
    {/if}
{/if}
{#if !updateBlock}
     <Content {block} />
{/if}

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
