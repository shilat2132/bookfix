import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import navStyles from '../styles/navbar.module.css'
import { Search } from './Search';

/**the navbar component */
export const Navigation = ()=>{
  return(
    <Navbar  data-bs-theme="dark" fixed="top" expand="lg" className={` ${navStyles.navbar}`}>
      <Navbar.Brand id={navStyles.navbarBrand} href="/">Bookfix</Navbar.Brand>

      <Navbar.Toggle id={navStyles.navbarToggler} aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`${navStyles.nav} me-auto`}>
             <NavLink className={`nav-link ${navStyles.navLink}`} to="/books">ספרי יד שנייה</NavLink>
             <NavLink className={`nav-link ${navStyles.navLink}`} to="/stories">הספרים שלי</NavLink>

             {/* the cart icon */}
            <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post" >
                <input type="hidden" name="cmd" value="_cart"/>
                <input type="hidden" name="business" value="A3X3LLY3J7P9J"/>
                <input type="hidden" name="display" value="1"/>
                <input type="image" className={navStyles.watchCart} src="https://i.ibb.co/C85Lbbc/ei-1704017289715-removebg-preview.png" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"/>
              </form>
          </Nav>
      </Navbar.Collapse>
    </Navbar>
    )
}

/**the root layout for every page in the react app
 * includes a navbar and a search bar
 */
const RootLayout = ()=>{
  const params = useParams()
  const collection = params.collection
    return(
       <>
        <Navigation/>
        <div className='container'>
          {(collection ==="books" || collection ==="stories") && <Search collection={collection} />}
          <Outlet/>
        </div>
        
       </>
    )
}

export default RootLayout;