<script>
    import {createEventDispatcher} from 'svelte'
    import f from '$lib/helpers/scripts'
    import TextInput from '$lib/UI/TextInput.svelte'
    import Button from '$lib/UI/Button.svelte'
    import Select from '$lib/UI/Select.svelte'
    import Notification from '$lib/UI/elements/Notification.svelte'
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

    const selectItems = [
        {
            text: 'à droite',
            value: 'right'
        },
        {
            text: 'à gauche',
            value: 'left'
        },
        {
            text: 'au dessus',
            value: 'top'
        },
        {
            text: 'dessous',
            value: 'bottom'
        }
    ]

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
    }
    //TODO: fusionner les 2 fonctions ci dessus ?
    //TODO: ajouter le choix de la position de l'image dans le block

    const deleteIllustration = () => {
        image = ''
        console.log('deleteIllustration image : ', {image})
    }

    const getSelectedImgPosition = (e) => {
        const {selected} = e.detail
        console.log('getSelectedImgPosition ds block', {selected})
        image_position = selected
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
        }
        if ( image !== '' && image !== blockBup.image) { 
            console.log('on a changé l image et on confirme donc détruite le bup',{image} )
            f.deleteOneImg(f.slashToUnderscore(blockBup.image))
            blockWithChanges.image = image
            
        }
        if ( image !== '' && blockBup.image === '') { 
            console.log('on ajoute une image, il n y en avait pas',{image} )
            blockWithChanges.image = image
            
        }
        if (image_width !== blockBup.image_width) {
            blockWithChanges.image_width = image_width
        }
        if (image_height !== blockBup.image_height) {
            blockWithChanges.image_height = image_height
        }
        if (image_position !== blockBup.image_position) {
            blockWithChanges.image_position = image_position
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
                label="Titre du block"
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
            <div class="columns">
                <div class="column">
                    {#if image}
                        <span class="label">Image illustrant ce block</span>
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
                        <span class="label">Image illustrant ce block</span>
                        <ImagUpload 
                        buttonText='Choisir' 
                        {croppingAspectRatio}
                        uploadPreset='Actibenne_illustrations' 
                        dispatchTitle='get-new-illustration-id'
                        on:get-new-illustration-id={getNewIllustrationId}
                        />
                    {/if}
                </div>
                <div class="column">
                    <span class="label">Position de l'image</span>
                    {image_position}
                    <Select 
                    {selectItems} 
                    selected={image_position}
                    on:get-selected={getSelectedImgPosition}
                    />
                    <Notification 
                    mt-3
                    is-info
                    is-light
                    text='par défaut : image à gauche du texte' 
                    />
                    
                </div>
            </div>
            <div class="buttons">
                <Button
                is-outlined
                is-primary
                enabled={true}
                fct={saveBlock}
                >
                    Enregistrer la modif
                </Button>
                <Button
                is-outlined
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
