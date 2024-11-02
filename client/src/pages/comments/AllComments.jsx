import { useState } from "react"
import { Form, useActionData } from "react-router-dom"
import { Comments } from "./CommentsItems"

/**at first shows a form of the admin password.
 * after the form is submitted, if authorized - shows the comments component. if not - shows an error message */
const AllComments = ()=>{
    const action = useActionData()
    const [showForm, setShowForm] = useState(true)

    if(showForm && action && action.comments){
        setShowForm(false)
    }

        
        return (<>
    {showForm && <Form method="POST">
        <input placeholder="סיסמת מנהל" type="text" required name="secret"/>
        <button>שלח</button>
        
        {action && action.error && <p className="formErrorMessage">{action.error} </p>}
        </Form>}

    {!showForm && <Comments from="admin" secret={action.secret} comments={action.comments}/> }
            </>
        )
}

/**
 * action for delete a comment or get all comments. both require admin password, aka secret
 */
export const commentsActions = async ({request, params})=>{
    const formData = await request.formData()
    const toDelete = request.method === "DELETE"
    const secret = formData.get("secret")
    let url = "/api/comments"
    if(toDelete){
        url+= `/${formData.get("id")}`
    }
    url+=`/${secret}`


    const response = await fetch(url, {method: toDelete ? "DELETE" : "GET"})

    if(!toDelete){
        const responseData = await response.json()

        if(!response.ok){
            return {error: responseData.message}
        }

        return {comments: responseData.docs, secret: secret}
    }else{
        if(!response.ok){
            const responseData = await response.json()
            return {error: responseData.message}
        }
    }
    return {success: "התגובה נמחקה"}
}

export default AllComments