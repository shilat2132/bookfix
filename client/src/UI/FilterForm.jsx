import { useNavigate, useSearchParams } from "react-router-dom"
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';

/**filters form component */
export const FilterForm = ({show, handleClose, collection})=>{
    const [searchParams]= useSearchParams()
    // gets the current search params
    const filters = {zenere: searchParams.get("zenere"), sortPrice: searchParams.get("sortPrice"), search: searchParams.get("search")}
    const navigate = useNavigate()
    const zeners = ["פנטזיה", "רומנטיקה", "אנגלית", "עיון", "מתח"]


    /**adds the filters and search value to the url and navigate to it and close the filters form */
    function handleSubmit(event){
        event.preventDefault()
        const zeneresArray = document.getElementsByName("zenere")
        let zenere;
        // checks the zenere that was checked
        for (const val of zeneresArray){
            if(val.checked) zenere = val.value
        }
        const sortPriceArray = document.getElementsByName("sortPrice")
        let sortPrice;

        // checks the sort price method that was checked

        for (const val of sortPriceArray){
            if(val.checked) sortPrice = val.value
        }
        let url = `/${collection}`
        if(filters.search) url+=`?search=${filters.search}`
        if(zenere || sortPrice){
            if(!filters.search){
                url+="?"
                if(zenere) url+=`zenere=${zenere}`
                if(sortPrice){
                    if(zenere) url+="&"
                    url+=`sortPrice=${sortPrice}`
                }
            } else{
                if(zenere) url+=`&zenere=${zenere}`
                if(sortPrice)url+=`&sortPrice=${sortPrice}`
            }
        
        } 
        navigate(url)
        handleClose()
    }
    return(
    <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
        <Offcanvas.Title>סינון</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                <div className="radioFormGroup">
                    <Form.Label><b>ז'אנר</b></Form.Label>
                    <br/>
                    <div className="radios">
                        {zeners.map((zenere, i)=>(
                            <Form.Check key={i} defaultChecked={filters.zenere && filters.zenere === zenere} 
                                value={zenere} inline label={zenere} name="zenere" type="radio"/>
                        ))}
                    </div>
                </div>
                <div style={{marginTop: "7%"}} className="radioFormGroup">
                    <Form.Label><b>מיון לפי מחיר</b></Form.Label>
                    <br/>
                    <div className="radios">
                        <Form.Check defaultChecked={filters.sortPrice && filters.sortPrice === "-1"} 
                            value="-1" inline label="מחיר יורד" name="sortPrice" type="radio"/>
                        <Form.Check defaultChecked={filters.sortPrice && filters.sortPrice === '1'} 
                            value="1" inline label="מחיר עולה" name="sortPrice" type="radio"/>
                    </div>
                </div>
                </div>
                <button className="button">סינון</button>
            </Form>
        </Offcanvas.Body>
    </Offcanvas>
    )
    }