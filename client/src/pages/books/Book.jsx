import bookStyles from '../../styles/book.module.css'
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { ItemGrid } from '../items/ItemGrid';


/**component for a book */
export const Book = ({item})=>{
    const {doc: book, extraData} = item
    const hasExtraData = extraData && extraData.length >0

    /** * Creates a object with modified HTML for use in React's `dangerouslySetInnerHTML`.
     *used for the payment button, adds a css class to the add to cart icon
 */
    function createMarkup(htmlString) {
        const replaceSearch = 'src="https://i.ibb.co/4P5LKnk/ei-1704014855402-removebg-preview.png"'
        const replaceTo = replaceSearch+' class= "addToCartImg"'
        const newHtmlStr = htmlString.replace(replaceSearch, replaceTo)
        return {__html: newHtmlStr};
      }

    return(
        <div className="container" style={hasExtraData ? {} : {marginBottom: "9%"}}>
            <Card className={`${bookStyles.card}`}>
                <div>
                    <Card.Img className={`${bookStyles.cover}`} variant="top" src={book.cover} alt={book.title}/>
                    <Card.Body >
                        <Card.Title className={`${bookStyles.title}`}>{book.title}</Card.Title>
                        <Card.Subtitle className={`${bookStyles.author} mb-2 text-muted`}>{book.author}<br/> {book.price}₪ 
                            {book.payBtn && <><br/><div dangerouslySetInnerHTML={createMarkup(book.payBtn)}/> </>}
                        </Card.Subtitle>
                    </Card.Body>
                </div>
                    <Card.Text className={`${bookStyles.text}`}>
                        <b>תקציר</b>
                        <br/>
                        <span className={bookStyles.summary}>{book.summary}</span>
                    </Card.Text>
                
            </Card>
            {hasExtraData && <div className={`container ${bookStyles.moreBooksContainer}`}> 
                <h6>עוד ספרים מאת {book.author}</h6>
                <Stack direction="horizontal" gap={3} className={`${bookStyles.moreBooks}`}>
                    {extraData.map(book=>(
                        <ItemGrid key={book._id} item={book} route={`/books/${book._id}`}/>
                    ))}
                </Stack>
            </div> }
        </div>
    )
}