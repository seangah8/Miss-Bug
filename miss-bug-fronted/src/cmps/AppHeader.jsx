import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { useState } from 'react'
import { UserMsg } from './UserMsg'
import { NavLink } from 'react-router-dom'
import { LoginSignup } from './LoginSignup.jsx'
import { userService } from '../services/user'
import { useLocation } from "react-router-dom"
import { useNavigate } from 'react-router-dom'

export function AppHeader() {

  const location = useLocation()
  const navigate = useNavigate()
  const [loggedinUser, setLoggedinUser] = useState(userService.getLoggedinUser())


  async function onLogin(credentials) {
      console.log(credentials)
      try {
          const user = await userService.login(credentials)
          setLoggedinUser(user)
          if(location.pathname === '/bug') window.location.reload()
      } catch (err) {
          console.log('Cannot login :', err)
          showErrorMsg(`Cannot login`)
      }
  }

  async function onSignup(credentials) {
      console.log(credentials)
      try {
          const user = await userService.signup(credentials)
          setLoggedinUser(user)
          showSuccessMsg(`Welcome ${user.fullname}`)
          if(location.pathname === '/bug') window.location.reload()
      } catch (err) {
          console.log('Cannot signup :', err)
          showErrorMsg(`Cannot signup`)
      }
      // add signup
  }

  async function onLogout() {
      try {
          await userService.logout()
          setLoggedinUser(null)
          if(location.pathname === '/profile') navigate('/')
          else if(location.pathname === '/user') navigate('/')
          else if(location.pathname === '/bug') window.location.reload()
      } catch (err) {
          console.log('can not logout');
      }
      // add logout
  }

  return (
    <header className='app-header '>
      <div className='header-container'>
      <UserMsg />
      <nav className='app-nav'>
        <NavLink to="/">Home</NavLink> 
        <NavLink to="/bug">Bugs</NavLink>
        { loggedinUser?.isAdmin ?  <NavLink to="/user">Users</NavLink>  : '' }
        <NavLink to="/about">About</NavLink> 
        { loggedinUser ?  <NavLink to="/profile">Profile</NavLink>  : '' }
      </nav>

      <section className="login-signup-container">
          {!loggedinUser && <LoginSignup onLogin={onLogin} onSignup={onSignup} />}

          {loggedinUser && <div className="user-preview">
              <h3>Hello {loggedinUser.fullname}</h3>
              <button onClick={onLogout}>Logout</button>
          </div>}
      </section>

      <h1>Bugs are Forever</h1>
      </div>
    </header>
  )
}
