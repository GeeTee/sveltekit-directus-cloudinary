<script>
    import {createEventDispatcher} from 'svelte'
    import {CLOUDINARY_NAME} from '$lib/helpers/Env'
    import f from '$lib/helpers/scripts'

    const dispatch = createEventDispatcher();

    // export let tagOwner = null; // le slug utilisateur
    // export let tagElt = null; // le slug elt ex post
    // export let tagBase = null; // le types ex : postGallery
    export let defaultSource = "local";
    export let uploadPreset = 'postGalleries';
    export let showAdvancedOptions = true;
    export let dispatchTitle = 'get-gallery-info';
    export let buttonText = "Galerie";

    export let thumbGallery = []

    let isLoading = false

    const handleUploadImage = () => {
        console.log('handleUploadImage')
        isLoading = true;
        cloudinary.openUploadWidget({
            // prepareUploadParams: function(cb, params) {
            // if (params.tags == null){
            //     params.tags=tagBase + "," + tagOwner + "," + tagElt
            // }
            // else{ 
            //     params.tags = params.tags + "," + tagBase + "," + tagOwner + "," + tagElt
            // }

            // cb({tags: params.tags});
            // },
            cloudName: CLOUDINARY_NAME, 
            uploadPreset,
            sources: [ 'local', 'url', 'camera', 'facebook', 'instagram', 'google_drive'],
            language: 'en',
            text: {
                'en': {
                    'or': 'ou bien',
                    'back': 'retour',
                    'advanced': 'Améliorer',
                    'close': 'fermer',
                    'no_results': 'Pas de résultats',
                    'search_placeholders': 'Chercher vos fichiers images, vidéos',
                    'about_uw': 'Au sujet du Widget Upload',
                    'menu': {
                        'files': 'Mes fichiers'
                    },
                    'actions' : {
                        'upload': 'Chargement',
                        'clear_all': 'Tout éffacer',
                        'log_out': 'Sortir'
                    },
                    'advanced_options': {
                        'public_id_ph': 'Nom image',
                        'tags_ph': 'Ajouter un tag',
                        'add_new': 'Ajouter un nouveau tag',
                    },
                    'statuses': {
                        'uploading': 'Chargement...',
                        'error': 'Erreur',
                        'uploaded': 'Réussi',
                        'aborted': 'Raté'
                    },
                    "queue": {
                        "title": "Liste à charger",
                        "title_uploading_with_counter": "Chargement de {{num}} fichiers",
                        'title_uploading': 'Chargment des fichiers',
                        'mini_title': 'Chargé',
                        'mini_title_uploading': 'Chargement',
                        'show_completed': 'voir le résultat',
                        'retry_failed': 'nouvelle tentative ratée',
                        'abort_all': 'Tout arréter',
                        'upload_more': 'Charger plus',
                        'done': 'Enregistrer',
                        'mini_upload_count': '{{num}} chargés',
                        'mini_failed': '{{num}} ratés'
                    },
                    "local": {
                        "main_title": "Charger des fichiers",
                        "dd_title_single": "Glisser et Déposer votre fichier ici",
                        "dd_title_multi": "Glisser et Déposer vos fichiers ici",
                        "drop_title_single": "Déposer votre fichier ici",
                        "drop_title_multi": "Déposer vos fichiers ici",
                    }
                }
            },
            multiple: true,
            defaultSource,
            showAdvancedOptions,
            // getTags: getMyTags,
                }, (error, result) => { 
                    
                    if (!error && result && result.event === "queues-end") { 
                    console.log('CLD UPLOAD: ', result);
                    dispatch(dispatchTitle, result.info.files);
                    isLoading = false;
                    } else if (result.event === 'close') {
                        isLoading = false;
                    }
                }
        );
    }

</script>
<h1>Gestion galerie imgs</h1>
{#if thumbGallery.length > 0}
     <ol>
        {#each thumbGallery as {public_id}}
             <li><img src={f.thumbImg(public_id)} alt="t"></li>
        {/each}
     </ol>
{/if}
<div>
    <button 
    class:is-loading={isLoading} 
    class:is-primary={thumbGallery.length === 0} 
    class:is-warning={thumbGallery.length > 0}
    class="button" 
    on:click={handleUploadImage}
    >
    <span class="icon is-small"><i class="fas fa-camera-retro"></i></span>
    <span>{buttonText}</span>
    </button>
</div>