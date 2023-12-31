import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom";
import RootLayout from "./UI/Root";
import Spinner from 'react-bootstrap/Spinner';
import { lazy, Suspense } from "react";
import './styles/generalStyling.css'
import { ErrorPage } from "./pages/ErrorPage";

const ItemsPage =lazy(()=> import('./pages/items/ItemsPage'))
const ItemPage = lazy(()=> import('./pages/items/ItemPage'))
const CreateItemPage = lazy(()=> import('./pages/items/itemsActions/CreateItemPage'))
const EditItemPage = lazy(()=> import('./pages/items/itemsActions/EditItemPage'))
const AllComments = lazy(()=> import('./pages/comments/AllComments'))


//path: /:collection/:id
const bookChildren = [
  {index: true, element: <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
    <ItemPage/> </Suspense>, action: ({request, params})=> import("./utils/actions")
  .then(module=> module.addCommentAction({request, params}))},
  {path: "edit",  element: <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
  <EditItemPage/> </Suspense>, loader: ({request, params})=> import('./utils/loaders')
          .then(module=> module.protectRoutesLoader({request, params})),
  action: ({request, params})=> import("./utils/actions")
    .then(module=> module.itemAction({request, params}))},
  {path:"delete", loader: ({request, params})=> import('./utils/loaders')
  .then(module=> module.protectRoutesLoader({request, params})), action: ({request, params})=> import("./utils/actions")
  .then(module=> module.deleteItemAction({request, params}))}
]

const mainLoader = ({params})=>{
  if(params.collection !== "books" && params.collection !== "stories"){
    return redirect("/books")
  } return null
}
const booksPaths = 
  {path: ":collection", loader: mainLoader, children: [
        {index: true,  element: <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
        <ItemsPage/> </Suspense>, loader: ({params, request})=> import('./utils/loaders')
          .then(module=> module.itemsLoader({params, request}))},
        {path: "create", element: <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
        <CreateItemPage/> </Suspense>,  loader: ({request, params})=> import('./utils/loaders')
          .then(module=> module.protectRoutesLoader({request, params})),
        action: ({request, params})=> import("./utils/actions")
          .then(module=> module.itemAction({request, params}))},
        {path: ":id", id: "book", loader: ({params})=> import('./utils/loaders')
          .then(module=> module.itemLoader({params})), children: bookChildren}
  ]}


const router = createBrowserRouter([
  {path: "/", errorElement: <ErrorPage/>, element: <RootLayout/>, children:[
    {index: true, loader: ()=> redirect("/books")},
    {path: "comments", element: <Suspense fallback={<Spinner animation="border" variant="secondary" />}>
    <AllComments/> </Suspense>, loader: ({request, params})=> import('./utils/loaders')
          .then(module=> module.protectRoutesLoader({request, params})),  action: ({request, params})=> import("./pages/comments/AllComments")
          .then(module=> module.commentsActions({request, params})) },
    booksPaths
  ]}
])

function App() {
 return <RouterProvider router={router}/>;
}

export default App;
