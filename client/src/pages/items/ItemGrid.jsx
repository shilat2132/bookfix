import Card from 'react-bootstrap/Card';
import itemGridStyles from '../../styles/itemGrid.module.css'
import bookStyles from '../../styles/book.module.css'
import { NavLink, useParams } from 'react-router-dom';

/**component for a single item (book/story) in a grid 
 * either a grid in the index page or a grid of the more books to show */
export const ItemGrid = ({item, route})=>{
   const params = useParams()
    return (
        <NavLink style={{"textDecoration": "none"}} className={route ? ` ${bookStyles.moreBooksGrid}` : ''} to={`/${params.collection}/${item._id}`}> 
            <Card  className={`${itemGridStyles.card}`}>
                <Card.Img className={route ? `${bookStyles.moreBooksCovers}`: `${itemGridStyles.cover}`} variant="top" src={item.cover} />
                <Card.Body>
                    <Card.Title className={`${itemGridStyles.title} ${bookStyles.moreTitle}`}>{item.title}</Card.Title>
                    <Card.Subtitle className={`${itemGridStyles.author} ${bookStyles.moreAuthor} mb-2 text-muted`}>{item.author}</Card.Subtitle>
                    <Card.Text className={`${itemGridStyles.text}`}>
                        {item.price}₪
                    </Card.Text>
                </Card.Body>
            </Card>
        </NavLink>
       
    )
}