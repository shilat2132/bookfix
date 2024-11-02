import bookStyles from '../../styles/book.module.css'
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import { ItemGrid } from '../items/ItemGrid';
import { StoryTabs } from '../../UI/StoryTabs';
import { CommentsSection } from '../comments/CommentsItems';

/**story component with comments section and tabs for story's details */
export const Story = ({item})=>{
    const {doc: book, extraData} = item
   
    const hasExtraData = extraData && extraData.length >0

return(
<div className="container" style={hasExtraData ? {} : {marginBottom: "9%"}}>
    <Card className={`${bookStyles.card} ${bookStyles.storyCard}`}>
        <div>
            <Card.Img className={`${bookStyles.cover}`} variant="top" src={book.cover} alt={book.title}/>
            <Card.Body >
                <Card.Title className={`${bookStyles.title}`}>{book.title}</Card.Title>
                <Card.Subtitle className={`${bookStyles.author} mb-2 text-muted`}>{book.author}<br/> {book.price}₪ </Card.Subtitle>
            </Card.Body>
        </div>
        <div className={`${bookStyles.text}`}>
            <StoryTabs summary={book.summary} aboutStory={book.aboutStory} prologe={book.prologe}/>
        </div>
    </Card>

        <CommentsSection comments={book.comments}/>

    {hasExtraData && <div className={`container ${bookStyles.moreBooksContainer}`}> 
        <h6>עוד ספרים בסדרת  {book.series}</h6>
        <Stack direction="horizontal" gap={3} className={`${bookStyles.moreBooks}`}>
            {extraData.map(book=>(
                <ItemGrid key={book._id} item={book} route={`/stories/${book._id}`}/>
            ))}
        </Stack>
    </div> }
</div>
    )
}