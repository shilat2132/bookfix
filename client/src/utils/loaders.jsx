import { defer, json, redirect } from "react-router-dom";


//PROTECT ROUTES
/**compares the passwoed in the url with the one saved in the config file
 * @return 200 in case of success and 401 for not authorized
 */
function protectRoutes({request}){
    const url = new URL(request.url).searchParams
    const password = url.get("password")
    if(!password || (password !== process.env.REACT_APP_PASSWORD)) return 401
    return 200
}

/**loader of the protected routes.
 * checks the password in the url and if authorized, return null
 */
export function protectRoutesLoader({request, params}){
    const authStatus = protectRoutes({request})
    if(authStatus !==200) {
        const collection = params.collection
        if(collection !== "books" && collection!== "stories"){
            return redirect ("/books")
        }else{
            return redirect(`/${collection}`)
        }
    }
    
    return null
}


/**returns the items docs in case of the collection being books or stories, otherwise throw an error
 * also handles url with filters and search params
 */
async function loadAllItems({params, request}){
    const collection = params.collection
    if(collection !== "books" && collection!== "stories"){
        return redirect ("/books")
    }
    let apiUrl = `/api/${collection}`
    // getting the search parameters (the ones after the ?) from the url and put it in the url for the api
    const url = new URL(request.url).searchParams
    if(url.size >0){
        apiUrl+="?"
        let i=0
        for (const key of url.keys()) {
            if(i>0) apiUrl+="&"
            apiUrl+= `${key}=${url.get(key)}`
            i++
          }
    }
    const response = await fetch(apiUrl)
    const responseData = await response.json()

    if(!response.ok){
        throw json({message: responseData.message}, {status: response.status})
    }

    return responseData.docs

}


/**loads the page of the items using defer to load the page without waiting for the data
 * @returns itemsData which is the docs of all the items
 */
export function itemsLoader({params, request}){
    return defer({itemsData: loadAllItems({params, request})})
}

/**retrives the item from the api */
async function loadItem({params}){
    const response = await fetch(`/api/${params.collection}/${params.id}`)
    const responseData = await response.json()
    if(!response.ok){
        throw json({message: responseData.message}, {status: response.status})
    }

    return responseData
}


/**load an item and defer */
export function itemLoader({params}){
    return defer({itemData: loadItem({params})})
}
