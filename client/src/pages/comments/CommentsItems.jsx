import { useFetcher } from "react-router-dom"
import formStyles from '../../styles/form.module.css'
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import commentsStyles from '../../styles/comments.module.css'
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

/**shows a list of comments, either for the admin with a delete button or for the user, as part of the comments section */
export const Comments = ({comments, from, secret})=>{
    const fetcher = useFetcher()
    if(!comments|| comments.length ===0){
        return <p style={{marginTop: "unset"}} className="generalMsg">עדיין לא נוספו תגובות</p>
    }
    const fromAdmin = from === "admin"

    /**available only for admin, to trigger the delete comment action without navigating to another page */
    function deleteComment(id){
        fetcher.submit({id, secret}, { method: "DELETE"})
    }

    return(
<div className={`${commentsStyles.row} text-center`}>
    {/* those are the messages that would be showed after trying to delete a comment - either an error or a success */}
    {fetcher.data && fetcher.data.error && <p className="errorMessage">{fetcher.data.error} </p>}
    {fetcher.data && fetcher.data.success && <p className="generalMsg">{fetcher.data.success} </p>}
    
    <h4 style={{textAlign: "right"}}>תגובות</h4>
    <div className={`row `}>
      {comments.map(comment=>(
            <Card key={comment._id} className={`col-xl-4 col-lg-5 col-12 col-sm-5 ${commentsStyles.commentCard}`} >
                <Card.Body className={commentsStyles.cardBody}>
                    <div className={commentsStyles.titles}>
                        <Card.Title className={commentsStyles.title}>{comment.name}</Card.Title>
                        {fromAdmin && <Card.Subtitle className={`${commentsStyles.subtitle} mb-2 text-muted`}>
                            {comment.story.title}</Card.Subtitle>}
                    </div>
                    <Card.Text className={commentsStyles.cardText}>{comment.text}
                        {fromAdmin && comment.email &&<> <br/> <span>{comment.email}</span>  </>}
                    </Card.Text>
                    {fromAdmin && <button onClick={e=> deleteComment(comment._id)} className="button">מחיקת תגובה</button> }
                </Card.Body>
          </Card>
      ))}
      
    </div>
</div>
    )
}

/**a form for adding a comment */
export function CommentForm(){
    const fetcher = useFetcher()

    /**submit handler for adding a new comment.
     * triggers the action of adding a comment and sends the comment's data
     */
    function handleSubmit(event){
        event.preventDefault()
        const formData = new FormData(event.target)
        const data ={}
        formData.forEach((value, key)=>{
            data[key] = value
        })
        fetcher.submit(data, {method: "POST"})
    }
        return(
            <form onSubmit={e=> handleSubmit(e)}>
                <Form.Group className={`mb-3 ${formStyles.formGroup}`}>
                    <Form.Label>שם</Form.Label>
                    <Form.Control name="name" type="text" required />
                </Form.Group>

                <Form.Group className={`mb-3 ${formStyles.formGroup}`}>
                    <Form.Label>אימייל</Form.Label>
                    <Form.Control name="email" type="text" />
                </Form.Group>

                <Form.Group className={`mb-3 ${formStyles.formGroup}`}>
                    <Form.Label>תגובה</Form.Label>
                    <Form.Control name="text" as="textarea" required />
                </Form.Group>
                {fetcher.data && fetcher.data.success && <p className="successMsg">{fetcher.data.success}</p>}
                {fetcher.data && fetcher.data.error && <p className="formErrorMessage">{fetcher.data.error}</p>}
                <button className={formStyles.button}>הוספה</button>
            </form>
        )
}

/**the comment section component.
 * has a model for adding a comment
 */
export function CommentsSection({comments}){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return(
        <div className={commentsStyles.commentsSection}>
            <button className="button" onClick={handleShow}>כתבו תגובה</button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>הוספת תגובה</Modal.Title>
                </Modal.Header>
                <Modal.Body><CommentForm/> </Modal.Body>
            </Modal>
            <Comments comments={comments} from="user"/>
        </div>
        )
        
}