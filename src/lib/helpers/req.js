import {DIRECTUS_URL} from './Env'
const url = DIRECTUS_URL

const getAllTest = async () => {
    const res = await fetch(`${url}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                query {
                    test {
                        id
                        title
                        slug
                        redaction
                        cld_public_id
                    }
                }
            `
        })
    })

    const {data: {test}} = await res.json()
    // console.log('req getAllTest', {test})
    return test
}

const getTestSlug = async (slug) => {
    if (typeof slug !== 'string') return
    // console.log('req getTestSlug', {slug})
    const res = await fetch(`${url}/graphql`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                query ($slug: String) {
                    test (filter: {slug: {_eq: $slug}}) {
                        title
                        redaction
                        cld_public_id
                    }
                }
            `,
            variables: {
                slug
            }
        })
    })

    const {data: {test}} = await res.json()
    const item = test[0]
    console.log('req getTestSlug', {item})
    return item    
}

// USERS 
const getCurrentUser = async () => {
    // console.log('getCurrentUser')
    const res = await fetch(`${url}/graphql/system`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                query {
                    users_me {
                        email
                    }
                }
            `
        })
    })

    const {data: {users_me}} = await res.json()
    console.log('getCurrentUser', {users_me})
}

const reqServices = {
    getAllTest,
    getTestSlug,
    getCurrentUser
}

export default reqServices