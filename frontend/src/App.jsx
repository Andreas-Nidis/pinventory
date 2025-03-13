import Navbar from './components/Navbar.jsx';
import { Routes, Route, useResolvedPath, Navigate } from 'react-router-dom';
import HomePage from './features/HomePage.jsx';
import ItemPage from './features/ItemPage.jsx';
import { Toaster } from 'react-hot-toast';
import GoogleSignIn from './components/GoogleSignIn.jsx';

function App() {
  const {pathname} = useResolvedPath();
  const isLoginPage = pathname === '/login';
  const isAuthenticated = !!localStorage.getItem('token');


  return (
    <>
      <div className='min-h-screen bg-base-200 transition-colors duration-300'>
        {isLoginPage? null : <Navbar />}

        <Routes>
          <Route path='/login' element={<GoogleSignIn />} />
          <Route path='/' element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/item/:id' element={isAuthenticated ? <ItemPage /> : <Navigate to="/login" />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
