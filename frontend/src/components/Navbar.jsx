import React from 'react'
import { useResolvedPath, useNavigate } from 'react-router-dom';
import { PackageOpen, SquareStack, LogOutIcon } from "lucide-react";
import { useItemStore } from '../store/useItemStore.js';

function Navbar() {
  const {pathname} = useResolvedPath();
  const isHomePage = pathname === '/';
  const navigate = useNavigate();
  const { items } = useItemStore();

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

            <div className='flex justify-start gap-2 items-center'>
              <PackageOpen className='size-8' />

              <span className='font-semibold font-mono tracking-widest text-2xl'>
                PINVENTORY
              </span>
          
            </div>

          </div>

          {/* SHOPPING CART */}
          <div className='flex gap-4 items-center ml-auto'>

            {isHomePage && (
              <>
                <div className='indicator'>
                  <div className='p-2 rounded-full hover:bg-base-200 flex'>
                    <SquareStack className='size-5'/>
                    <span className='px-2 hidden lg:block'>Items:</span>
                    <div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">{items.length}</span>
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