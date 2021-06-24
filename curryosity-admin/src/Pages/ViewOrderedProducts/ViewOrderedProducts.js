import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
axios.defaults.withCredentials  = true
export default function ViewOrderedProducts() {
    const location = useLocation()
    const history = useHistory()
    const [orderId,setOrderId] = useState(location.id)
    console.log(location);
    const [orderedProducts , setOrderedProducts] = useState([])
    const getOrderProducts  = ()=>{
        axios.post('/admin/ordered-products' ,{orderId},{withCredentials:true}).then( response=>{
          console.log(response);
          if(response.data.loggedIn === false ){
              history.push('/admin/')
          }
          setOrderedProducts(response.data)
        })
      }
      console.log(orderedProducts);
    useEffect(() => {
        getOrderProducts()
    }, [])
    return (
        <div className="container">
        <div className="row">
            <div className="col-12">
        <table class="table">
            <thead>
              <tr>
              <th scope="col">Sl.No</th>
                <th scope="col"> </th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderedProducts.map( (product , index) =>(

                <tr className="table-row">
                    <th scope="row">{index + 1}</th>
                  <td><img className="product-preview" src={` data:{{` + product.product.contentType + `}};base64,` + product.product.base64} alt=" " /></td>
                  <td>{product.product.productName}</td>
                  <td>{product.product.category}</td>
                  <td>{product.quantity}</td>
                  <td>{product.product.price}</td>
                </tr>
              ))}
        
            </tbody>
          </table>     
        </div>
        </div>
        </div>
    )
}
