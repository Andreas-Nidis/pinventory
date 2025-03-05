import React from 'react'
import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from "lucide-react";

function Navbar() {
  return (
    <div className='bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto'>
        <div className='navbar px-4 min-h-[4rem] flex items-center'>
          {/* Logo */}
          <div className='flex-1 lg:flex-none'>
            <Link to='/' className='hover:opacity-80 transition-opactiy' />

            <div className='flex justify-start gap-2 items-center'>
              <ShoppingCartIcon className='size-8' />

              <span className='font-semibold font-mono tracking-widest text-2xl'>
                PORTSTORE
              </span>
            </div>
            
          </div>

        </div>

      </div>

    </div>
  )
}

export default Navbar