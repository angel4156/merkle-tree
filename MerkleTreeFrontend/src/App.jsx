import React from 'react'
import {
  Routes,
  Route
} from 'react-router-dom'
import { Container } from 'react-bootstrap'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

import Preloader from './containers/Preloader'
import Toast from './containers/Toast'

import ProtectedRoute from './helpers/ProtectedRoute'
import NonProtectedRoute from './helpers/NonProtectedRoute'

import './App.css'

function App() {
  return (
    <Container className='App'>
      <Routes>
        {/* <Route path='/' element={<React.Fragment><ProtectedRoute><Home /></ProtectedRoute></React.Fragment>} />
        <Route path='/login' element={<React.Fragment><NonProtectedRoute><Login /></NonProtectedRoute></React.Fragment>} />
        <Route path='/signup' element={<React.Fragment><NonProtectedRoute><Signup /></NonProtectedRoute></React.Fragment>} /> */}
        <Route path='/' element={<React.Fragment><Home /></React.Fragment>} />
      </Routes>
      <Preloader />
      <Toast />
    </Container>
  )
}

export default App
