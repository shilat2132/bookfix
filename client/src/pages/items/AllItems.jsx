import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ItemGrid } from './ItemGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { FilterForm } from '../../UI/FilterForm';

/**component for all of the items with a filter form in case this is the books collection */
export const AllItems = ({items})=>{
    const params = useParams()
    const [searchParams] = useSearchParams()
    const searchTerm = searchParams.get("search")
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if(items.length ===0){
        return (
            <>
            {params.collection === "books" && <> <svg onClick={handleShow} xmlns="http://www.w3.org/2000/svg" 
                width="26" height="26" fill="currentColor" className="bi bi-filter filterIcon" viewBox="0 0 16 16">
                <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"></path>
                </svg>
                <FilterForm show={show} handleClose={handleClose} collection={params.collection} /> </>
            }
            <p style={{marginTop: "0"}} className='generalMsg'> לא נמצאו תוצאות</p>
            </>)
    }
    
    return (<Container>
       {searchTerm &&  <p style={{marginTop: "0"}} className='generalMsg'> מציג תוצאות עבור {searchTerm}</p>}
       {params.collection === "books" && <> <svg onClick={handleShow} xmlns="http://www.w3.org/2000/svg" 
        width="26" height="26" fill="currentColor" className="bi bi-filter filterIcon" viewBox="0 0 16 16">
        <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"></path>
        </svg>
       <FilterForm show={show} handleClose={handleClose} collection={params.collection} /> </>}
        <Row style={{alignItems: "baseline"}} >
            {items.map(item=>(
                <Col  xs={6} sm={4} md={3} lg={3} xl={3} key={item._id}>
                    <ItemGrid key={item._id} item={item}/>
                 </Col>
            ))}
        </Row>
    </Container>
    )
}