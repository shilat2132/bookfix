import { defer, json, redirect } from "react-router-dom";


//PROTECT ROUTES
/**compares the passwoed in the url with the onw saved in the config file
 * @return 200 in case of success and 401 for not authorized
 */
function protectRoutes({request}){
    const url = new URL(request.url).searchParams
    const password = url.get("password")
    console.log("All environment variables:", process.env);
    console.log("REACT_APP_PASSWORD:", process.env.REACT_APP_PASSWORD);
    if(!password || (password !== process.env.REACT_APP_PASSWORD)) return 401
    return 200
}

export function protectRoutesLoader({request, params}){
    const authStatus = protectRoutes({request})
    console.log(authStatus)
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

async function loadAllItems({params, request}){
    const collection = params.collection
    if(collection !== "books" && collection!== "stories"){
        return redirect ("/books")
    }
    let apiUrl = `/api/${collection}`
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

export function itemsLoader({params, request}){
    return defer({itemsData: loadAllItems({params, request})})
}


async function loadItem({params}){
    const response = await fetch(`/api/${params.collection}/${params.id}`)
    const responseData = await response.json()
    if(!response.ok){
        throw json({message: responseData.message}, {status: response.status})
    }

    return responseData
}

export function itemLoader({params}){
    return defer({itemData: loadItem({params})})
}
