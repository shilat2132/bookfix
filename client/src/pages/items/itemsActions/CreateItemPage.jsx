import { useParams } from "react-router-dom"
import { ItemForm } from "../../items/itemsActions/ItemForm"


const CreateItemPage = ()=>{
    const params = useParams()
    return <ItemForm method="post" collection={params.collection}/>
}

export default CreateItemPage