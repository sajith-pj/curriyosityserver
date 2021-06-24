import React, { useEffect } from 'react'
import { BrowserRouter as Router ,Switch,Route } from 'react-router-dom'
import Navbar from '../Compnents/Navbar/Navbar'
import Products from '../Pages/Products/Products'
import Order from '../Pages/Order/Order'
import ChangePassword from '../Pages/ChangePassword/ChangePassword'
import AddProducts from '../Pages/AddProducts/AddProducts'
import axios from 'axios'
import EditProduct from '../Pages/EditProduct/EditProduct'
import ViewOrderedProducts from '../Pages/ViewOrderedProducts/ViewOrderedProducts'
axios.defaults.withCredentials = true;
export default function InnerRoutes() {


  
    return (
        <>
     
         <Navbar/>
          <Route  path="/admin/products"> <Products/></Route>
          <Route path="/admin/Orders"  component={Order} />  
         <Route path="/admin/change-password"  component={ChangePassword} />  
         <Route path="/admin/add-products"  component={AddProducts} />
         <Route path="/admin/edit-product"  component={EditProduct} />
         <Route path="/admin/ordered-products"  component={ViewOrderedProducts} />
        </>
    )
}
