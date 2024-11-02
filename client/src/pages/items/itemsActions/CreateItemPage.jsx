import { useParams } from "react-router-dom"
import { ItemForm } from "../../items/itemsActions/ItemForm"


/**the page for creating a new book with the itemForm component
 * this is a protected route with password in the url
 */
const CreateItemPage = ()=>{
    const params = useParams()
    return <ItemForm method="post" collection={params.collection}/>
}

export default CreateItemPage