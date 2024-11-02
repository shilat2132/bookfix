import { Suspense } from "react"
import { Await, useParams, useRouteLoaderData } from "react-router-dom"
import Spinner from 'react-bootstrap/Spinner';
import { Book } from "../books/Book";
import { Story } from "../books/Story";


/**item page, loads different component for a book and a story */
const ItemPage = ()=>{
    const {itemData} = useRouteLoaderData("book")
    const params = useParams()

    return (
        <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
            <Await resolve={itemData}>
                {item=>{
                    if(params.collection === "books"){
                        return <Book item={item}/>
                    }else{
                        return <Story item={item}/>
                    }
                }}
            </Await>
        </Suspense>
    )
}

export default ItemPage