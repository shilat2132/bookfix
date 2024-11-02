import { Suspense } from "react"
import { Await, useLoaderData } from "react-router-dom"
import Spinner from 'react-bootstrap/Spinner';
import { AllItems } from "./AllItems";

/**Renders a list of items with asynchronous data loading, displaying a loading spinner while waiting. */
const ItemsPage = ()=>{
    const {itemsData} = useLoaderData()
    return (
        <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
            <Await resolve={itemsData}>
                {items=>(<AllItems items={items}/>)}
            </Await>
        </Suspense>
    )
}

export default ItemsPage;
