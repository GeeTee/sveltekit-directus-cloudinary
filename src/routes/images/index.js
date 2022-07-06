

import { v2 as cloudinary } from 'cloudinary'



import {CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} from '$lib/helpers/Env'

cloudinary.config({ 
  cloud_name: CLOUDINARY_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET,
  secure: true
});

export const get = async () => {
    const res = await cloudinary.api.resources_by_tag('actibenne-banners', {tags: true,
    max_results: 100})

    const {resources} = res
    // console.log('get res index.svelte', {resources}, 'length : ', resources.length,)
    const srcArr = resources.map(img => {return img.public_id})
    // console.log('get res index.svelte', {srcArr})
    return {
        body: {
            srcArr
        }
    }
}