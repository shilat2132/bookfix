import { Form as FormComp ,useActionData} from "react-router-dom"
import formStyles from '../../../styles/form.module.css'
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { DeleteModal } from "../../../UI/DeleteModal";
import Modal from 'react-bootstrap/Modal';

export const ItemForm = ({method, collection, item})=>{
    const action = useActionData()
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const isBook = collection==="books"
    const toUpdate = method === "PATCH"
    let book;
    if(item){
        book = item.doc
    }
    const inputs = [
        {name: "title", isRequired: true, label: "שם הספר"},
        {name: "cover", isRequired: true, label: "כריכה"},
        {name: "price", inputType: "number", isRequired: true, label: "מחיר"},
        {name: "zenere", inputType: isBook ? "select": "text", isRequired: isBook, label: "ז'אנר"},
        {name: "summary", inputType: "textarea", isRequired: true, label: "תקציר"},
        {name: "payBtn", inputType: "textarea", isRequired: false, label: "כפתור קנייה"},
    ]

    if(collection === "books"){
        inputs.push({name: "authorHasMoreBooks", inputType: "select", isRequired: false, 
            label: "האם לסופר יש עוד ספרים למכירה?"},{name: "author", isRequired: isBook, label: "שם הסופר"},)
    }else{
        inputs.splice(3, 0, 
            {name: "publishYear", inputType: "number", isRequired: true, label: "שנת הוצאה"},
            {name: "series", isRequired: false, label: "שם סדרה (אם חלק מסדרה)"},
            {name: "seriesNum", isRequired: false, label: "מספר הספר בסדרה"},
            {name: "prologe", inputType: "textarea", isRequired: false, label: "פרולוג"},
            {name: "aboutStory", inputType: "textarea", isRequired: false, label: "על הספר"},
            )
    }

    return(
        <>
            <FormComp method={method} className={formStyles.form}>
                {inputs.map((input, i)=>{
                   if(input.inputType === "select"){
                    let options;
                    if(input.name==="zenere"){
                        options = <>
                            <option value="פנטזיה">פנטזיה</option>
                            <option value="רומנטיקה">רומנטיקה</option>
                            <option value="מתח">מתח</option>
                            <option value="אנגלית">אנגלית</option>
                            <option value="עיון">עיון</option>
                        </>
                    }else{
                        options = <>
                            <option value="true">כן</option>
                            <option value="false">לא</option>
                        </>
                    }
                    return(
                        <Form.Select defaultValue={toUpdate ? book[input.name]: ''} required={input.isRequired} className={formStyles.select} key={i} name={input.name} aria-label={input.label}>
                            <option value="">{input.label}</option>
                            {options}
                        </Form.Select>
                    )
                   }else if(input.inputType === "textarea"){
                        return(
                            <Form.Group key={i} className={`mb-3 ${formStyles.formGroup}`} controlId={`formGroup${input.name}`}>
                                <Form.Label>{input.label}</Form.Label>
                                <Form.Control defaultValue={toUpdate ? book[input.name]: ''} name={input.name} as="textarea" rows={3} required={input.isRequired} />
                            </Form.Group>
                        )
                   }

                   return(
                    <Form.Group key={i} className={`mb-3 ${formStyles.formGroup}`} controlId={`formGroup${input.name}`}>
                        <Form.Label>{input.label}</Form.Label>
                        <Form.Control defaultValue={toUpdate ? book[input.name]: ''} name={input.name} type={input.inputType || "text"} required={input.isRequired} />
                    </Form.Group>
                   )
                })}
                <Form.Group className={`mb-3 ${formStyles.formGroup}`} controlId={`formGroupPassword`}>
                        <Form.Label>סיסמת מנהל</Form.Label>
                        <Form.Control name="secret" type="text" required />
                </Form.Group>
               <div className="text-center">
                {action && action.error && <p className="errorMessage">{action.error} </p>}
                <Modal show={show} onHide={handleClose}><DeleteModal handleClose={handleClose}/> </Modal>
                <button className={`${formStyles.button} ${formStyles.deleteBtn}`} type="button" onClick={handleShow}>מחיקת פריט</button>
                <button className={`${formStyles.button}`}>סיים</button>
               </div>
           
            </FormComp>
        </>
    )
}