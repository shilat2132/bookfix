import {redirect} from 'react-router-dom'


/**return the body obj only with the fields which were actually updated*/
function clearUndefinedFields(obj){
    const newObj ={}
    Object.keys(obj).forEach(key=>{
        if(obj[key] && obj[key].length>0){
            newObj[key]= obj[key]
        }
    })
    return newObj
}

/**deleting a book/story */
export const deleteItemAction = async ({request, params})=>{
    const collection = params.collection
    const formData = await request.formData()
    const url = `/api/${collection}/${params.id}`

    const response = await fetch(url, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({secret: formData.get("secret")})
    })

    if(!response.ok){
        const responseData = await response.json()
        return {error: responseData.message}
        // throw json({message: responseData.message}, {status: response.status})
    }

    return redirect(`/${collection}`)

}

/**creating or updating a book/story */
export const itemAction = async ({request, params})=>{
    const method = request.method
    const collection = params.collection
    
    const body = Object.fromEntries(await request.formData());
    const bookDataObj = clearUndefinedFields(body)

    let url = `/api/${collection}`
    if(method === "PATCH"){
        url += `/${params.id}`
    }
    const response = await fetch(url, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bookDataObj)
    })

    const responseData = await response.json()

    if(!response.ok){
        return {error: responseData.message || "something went wrong"}
    }
    let redirectUrl = `/${collection}`
    if(method === "PATCH"){
        redirectUrl += `/${params.id}`
    }else{
        redirectUrl += `/${responseData.docId}`
    }

    return redirect(redirectUrl)
}


/**action for adding a comment. recieves the comment's data*/
export const addCommentAction = async({request, params})=>{
    const body = Object.fromEntries(await request.formData());
    body.story = params.id

    const response = await fetch("/api/comments", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })

    const responseData = await response.json()

    if(!response.ok){
        return {error: responseData.message || "something went wrong"}
    }
    return {success: "התגובה נוספה בהצלחה"}
}