import Navbar from './components/Navbar.jsx';
import { Routes, Route, useResolvedPath } from 'react-router-dom';
import HomePage from './features/HomePage.jsx';
import ProductPage from './features/ProductPage.jsx';
import { Toaster } from 'react-hot-toast';
import GoogleSignIn from './components/GoogleSignIn.jsx';

function App() {
  const {pathname} = useResolvedPath();
  const isLoginPage = pathname === '/login';
  return (
    <>
      <div className='min-h-screen bg-base-200 transition-colors duration-300'>
        {isLoginPage? null : <Navbar />}

        <Routes>
          <Route path='/login' element={<GoogleSignIn />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:id' element={<ProductPage />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
