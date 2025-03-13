import React from 'react'
import { Link, useResolvedPath, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, ShoppingBagIcon, LogOutIcon } from "lucide-react";

function Navbar() {
  const {pathname} = useResolvedPath();
  const isHomePage = pathname === '/';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='navbar px-4 min-h-[4rem] flex items-center'>
          {/* Logo */}
          <div className='flex-1 lg:flex-none'>
            {/* <Link to='/' className='hover:opacity-80 transition-opactiy'> */}

              <div className='flex justify-start gap-2 items-center'>
                <ShoppingCartIcon className='size-8' />

                <span className='font-semibold font-mono tracking-widest text-2xl'>
                  PINVENTORY
                </span>
            
              </div>
            {/* </Link> */}

          </div>

          {/* SHOPPING CART */}
          <div className='flex gap-4 items-center ml-auto'>

            {isHomePage && (
              <>
                <div className='indicator'>
                  <div className='p-2 rounded-full hover:bg-base-200 flex'>
                    <ShoppingBagIcon className='size-5'/>
                    <div className='-translate-y-3'>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">8{/* {products.length} */}</span>
                    </div>
                  </div>
                </div>

                {/* LOGIN BUTTON */}
                <button onClick={handleLogout} className='btn btn-ghost'>
                  <LogOutIcon className='size-5' />
                  <span className='hidden lg:block'>Logout</span>
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Navbar