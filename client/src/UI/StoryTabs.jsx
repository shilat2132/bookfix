import Nav from 'react-bootstrap/Nav';
import bookStyles from '../styles/book.module.css'
import { useMemo, useState } from 'react';

export const StoryTabs = ({summary, aboutStory, prologe})=>{
    let patialProloge;

    // useMemo hook would cache the prologe's substring so it wouldn't be recreated each time the component is rerendered
    patialProloge =  useMemo (()=> {
        if(prologe){
            return prologe.substr(0, 390)
        }
        // eslint-disable-next-line
    }, [prologe])

    // set the default content to summary, controls the content to be showed
    const [content, setContent] = useState({passage: summary, additional: null})
    
    /**changes the content to be showed by the tab that was clicked on */
    function handleTabClick(event){
        const id = event.target.id
        if(id === "summary"){
            setContent({passage: summary, additional: null})
        }else if(id==="aboutStory"){
            setContent({passage: aboutStory, additional: null})
        }else{
            setContent({passage: patialProloge, additional: "הראה יותר"})
        }
    }

    /**toggles between show more and show less in the prologe and sets the content respectively */
    function toggleShowProloge(){
        if(content.additional === "הראה יותר"){
            setContent({passage: <div className={bookStyles.fullProloge}>{prologe} </div> , additional: "הראה פחות"})
        }else{
            setContent({passage: patialProloge, additional: "הראה יותר"})
        }
    }
    return(
        <>
        <Nav variant="tabs" className={`navTabs ${bookStyles.navTabs}`} defaultActiveKey="summary">
          <Nav.Item>
            <Nav.Link className={bookStyles.tab} onClick={e=> handleTabClick(e)} id='summary' eventKey="summary">תקציר</Nav.Link>
          </Nav.Item>
          {aboutStory &&<Nav.Item>
            <Nav.Link className={bookStyles.tab} onClick={e=> handleTabClick(e)} id='aboutStory' eventKey="aboutStory">על הספר</Nav.Link>
          </Nav.Item>}
          {prologe && <Nav.Item>
            <Nav.Link className={bookStyles.tab} onClick={e=> handleTabClick(e)} id='prologe' eventKey="prologe">
              פרולוג
            </Nav.Link>
          </Nav.Item>}
      </Nav>
      <div className={` ${bookStyles.summary}`}>
        {content.passage} {content.additional && <button className={bookStyles.showBtn} onClick={toggleShowProloge}>{content.additional} </button>}
      </div>
        </>
    )
}