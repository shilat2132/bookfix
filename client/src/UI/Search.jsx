import { Form, useNavigate } from "react-router-dom"
import searchStyles from '../styles/search.module.css'


export const Search = ({collection})=>{
    const navigate = useNavigate()

    function handleSubmit(event){
        event.preventDefault()
        const search = document.getElementById("search").value
        navigate(`/${collection}?search=${search}`)
    }
    return (
        <Form onSubmit={handleSubmit} className={searchStyles.searchForm}>
            <div className={searchStyles.formGroup}>
                <input className={searchStyles.searchBar} id="search" type="search" name="search" placeholder="חיפוש"/>
            </div>
            <button className={searchStyles.searchBtn}>חפש</button>
        </Form>
    )
   
}