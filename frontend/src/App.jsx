import Navbar from './components/NavBar.jsx'
import { Routes, Route } from 'react-router-dom';
import HomePage from './features/HomePage.jsx';
import ProductPage from './features/ProductPage.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <div className='min-h-screen bg-base-200 transition-colors duration-300'>
        <Navbar />

        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/product/:id' element={<ProductPage />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
