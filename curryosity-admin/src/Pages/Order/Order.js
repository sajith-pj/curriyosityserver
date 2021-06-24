import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom';

export default function Order() {

  const [ orders, setOrder ]  = useState([])
  const history =  useHistory()
    const getOrderDetails = ()=>{
        axios.get('/admin/orders',{withCredentials:true}).then( response =>{
          if(response.data.loggedIn === false ){
              history.push( '/admin/')
          }
        setOrder(response.data)
        })
    }




    useEffect( ()=>{
        getOrderDetails()
    },[])

    return (
        <div className="container">
      <div className="row mt-3">
        <div className="col-12">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Sl.No</th>
                <th scope="col"> Date </th>
                <th scope="col"> Address</th>
                <th scope="col"> Pin code</th>
                <th scope="col">Phone</th>
                <th scope="col"> Purchase Amount </th>
              </tr>
            </thead>
            <tbody>
              {orders.map( (order,index) =>(

                <tr className="table-row">
                  <td> {index+1} </td>
                  <td> {order.date} </td>
                  <td> {order.deliveryDetails.address} </td>
                  <td> {order.deliveryDetails.pincode} </td>
                  <td> {order.deliveryDetails.phone} </td>
                  <td> {order.total} </td>
                  <td> <Link to={{pathname:'/admin/ordered-products',id: order._id}} className="btn btn-success"  > View Products</Link> </td>
                  
                </tr>
              ))}
        
            </tbody>
          </table>
        </div>
      </div>
        </div>
    )
}
