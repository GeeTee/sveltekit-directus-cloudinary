const condensifyPhone = (phone) => {
    if (typeof phone === 'string') {
        return phone.trim().replace(/ /g, '')
    }
    // console.log('condensifyPhone', {phone}, typeof phone)
}

const checkAuthentif = (beA, isA, href) => {
    // beA = beAutheticated
    // isA = isAuthenticated
    // console.log('checkAuthentif', {beA}, {isA})
    if (typeof beA !== 'boolean' || (isA && typeof isA !== 'boolean') || (href && typeof href !== 'string')) return 
    if (beA === true && isA === true) {
        return false
    }
    if (beA === true && isA === false) {
        return true
    }
    if (beA === false && isA === true && href === '/login') {
        return true
    }
    return false
}

const slashToUnderscore = (str) => {
  return str.replace(/\//g, "_");
}

const underscoreToSlash = (str) => {
  return str.replace(/\_/g, '/');
}

const deleteOneEltFromArray = (arr, value) => { 
    const newArr = arr.filter(function(ele){ 
            return ele != value; 
        })
    console.log('deleteOneEltFromArray', {newArr})
    return newArr
}
    

// cloudinary
const bannerResizeW = (w, public_id) => {
    return `https://res.cloudinary.com/geeteeimages/image/upload/c_scale,dpr_1.0,q_auto,w_${w}/${public_id}`
}

const thumbImg = (public_id) => {
  return `https://res.cloudinary.com/geeteeimages/image/upload/c_limit,h_100,w_150/${public_id}`
}

const deleteOneImg = async (slug) => { 
  console.log('deleteOneImg', {slug})
  const response = await fetch(`/images/${slug}`, {
    method: "DELETE"
  });
  if(response.ok) {
    console.log('détruit!')
  }
}

const deleteAllImgsFromArray = async (array) => {
  array.forEach(slug => {
    deleteOneImg(slug)
  });
}

const scriptsServices = {
    condensifyPhone,
    checkAuthentif,
    bannerResizeW,
    thumbImg,
    deleteOneImg,
    deleteAllImgsFromArray,
    slashToUnderscore,
    underscoreToSlash,
    deleteOneEltFromArray
}
export default scriptsServices