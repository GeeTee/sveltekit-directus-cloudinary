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
        console.log('renewIllustration')
        //TODO:
    }

    const getNewIllustrationId = (e) => {
        console.log('getNewIllustrationId')
        //TODO:
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
        if (image !== blockBup.image) {
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
    }

    const cancelModifBlock = () => {
        console.log('cancelModifBlock')
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
                imageInstalled={true}
                uploadPreset='Actibenne_banners' 
                dispatchTitle='renew-illustration-id'
                dn={dnBanner}
                imgResize={f.imgSquareW}
                w=200
                on:renew-illustration-id={renewIllustrationId}
                />
            {:else}
                <ImagUpload 
                buttonText='Choisir' 
                {croppingAspectRatio} 
                uploadPreset='Actibenne_banners' 
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
                    Abandonner la modif
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
            on:click={() => isEdited = true}
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
