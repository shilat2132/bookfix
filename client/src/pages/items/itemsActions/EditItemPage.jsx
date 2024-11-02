import { Suspense } from "react"
import { Await, useParams, useRouteLoaderData } from "react-router-dom"
import Spinner from 'react-bootstrap/Spinner';
import { ItemForm } from "./ItemForm";


/**a page component for editing a book/story and loads a form */
const EditItemPage = ()=>{
    const {itemData} = useRouteLoaderData("book")
    const params = useParams()
    return (
        <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
            <Await resolve={itemData}>
                {item=>(<ItemForm item={item} method="PATCH" collection={params.collection} />)}
            </Await>
        </Suspense>
    )
}

export default EditItemPage