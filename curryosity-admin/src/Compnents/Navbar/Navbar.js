import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
axios.defaults.withCredentials= true;

export default function Navbar() {
  const history = useHistory()
  const logout = ()=>{
    axios.get('/admin/logout',{withCredentials:true}).then( response =>{
      if(response.data.logOut){
        console.log(response.data.logOut);
        history.push('/admin/')
      }
    } )
  }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container">
    <Link className="navbar-brand"  to='/admin/products'>Curryosity</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

        <li className="nav-item">
          <Link className="nav-link" to="/admin/products"> Products</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/orders">Orders</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/admin/change-password">Change Password</Link>
        </li>
        <li className="nav-item">
          <button   className="btn btn-outline-secondary" onClick={logout}> Logout </button>
        </li>
      </ul>
    </div>
  </div>
</nav>
    )
}
