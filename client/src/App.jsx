import './App.css'
import { User } from './getUser/User'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import  UpdateUser  from './updateUser/UpdateUser'
import SignIn from './signin/SignIn'
import LogIn from './login/LogIn'
import AdminTickets from './admin/tickets/AdminTickets'
import Home from './home/Home'
import SearchPage from './pages/Search/Search'
import Add_skelbima from './pages/Search/add_skelbima'
import CarListings from './pages/user/CarListings'
import NotFound from './pages/NotFound/NotFound'
import ViewPosts from './pages/userPostsAndWishlist/viewPosts'
import EditPost from './pages/userPostsAndWishlist/EditPost'

function App() {
  const route = createBrowserRouter([
    {
        path: '/',
        element:<Home />
    },
    {
      path:"/update/:id",
      element:<UpdateUser/>
    },
    {
      path:"/signin",
      element:<SignIn/>
    },
    {
      path:"/login",
      element:<LogIn/>
    },
    {
      path:"/admin/posts",
      element:<AdminTickets/>
    },
    {
      path:"/admin/users",
      element:<User />
    },
    {
      path:"/search",
      element:<SearchPage/>
    },
    {
      path:"/add_skelbima",
      element:<Add_skelbima/>
    },
    {
      path:"/:id/renginys",
      element:<CarListings/>
    },
    {
      path:"/:id/posts",
      element:<ViewPosts/>
    },
    
    {
      path:"/edit",
      element:<EditPost/>
    },
    {
      path:"*",
      element:<NotFound/>
    }
    // {
    //   path:"*",
    //   element:<ForOFor/>
    // }

    
    
  ])

  return (
    <>
      <RouterProvider router={route}></RouterProvider>
    </>
  )
}

export default App
