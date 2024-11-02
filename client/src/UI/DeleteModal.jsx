import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useFetcher, useParams } from 'react-router-dom';

export const DeleteModal = ({handleClose})=>{
  const  [error, setError] = useState()
  const fetcher = useFetcher()
  const params = useParams()

      /**sends the api delete request and sets the error in case there wasn't any password entered
       * clear any previous error
       */
      function handleDeleteItem(){
          const secret = document.getElementById("secretOfDelete").value
          if(!secret || secret.length === 0){
              setError("עליך להזין סיסמה")
              fetcher.data = undefined
              return;
          }
          if(error){setError(null)}
          fetcher.submit({secret}, {method: "DELETE", action: `/${params.collection}/${params.id}/delete`})
      }
      return(
          <>
          <Modal.Header closeButton>
            <Modal.Title>האם ברצונך למחוק את הספר?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <input placeholder='סיסמת מנהל' required id='secretOfDelete' name='secret' type='text'/> 
              {fetcher.data && <p className='errorMessage'>{fetcher.data.error} </p>}
              {error && <p className='errorMessage'>{error} </p>}
              </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              סגירה
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              מחיקה
            </Button>
          </Modal.Footer>
          </>
      )

}