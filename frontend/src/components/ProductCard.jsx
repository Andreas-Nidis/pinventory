import { Link } from 'react-router-dom';
import { EditIcon, Trash2Icon } from 'lucide-react';
import React from 'react'

function ProductCard({product}) {
    console.log(product);
  return (
    <div className='card bg-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300'>

      {/* Product Image */}
      <figure className='relative pt-[56.25%]'>
        <img 
          src={product.image}
          alt={product.name}
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      </figure>

      <div className='card-body'>
        {/* Product Information */}
        <h2 className='card-title text-lg font-semibold pl-4 pt-2'>{product.name}</h2>
        <p className='text-2xl font-bold text-primary pl-4'>${Number(product.price).toFixed(2)}</p>

        {/* Card Actions */}
        <div className='flex card-actions justify-end mt-4 p-2'>
          <Link to={`/product/${product.id}`} className='pr-2 btn btn-sm btn-info btn-outline'>
            <EditIcon className='size-5' />
          </Link>

          <button className='btn btn-sm btn-error btn-outline'>
            <Trash2Icon className='size-5' />
          </button>
        </div>
      </div>

    </div>
  )
}

export default ProductCard