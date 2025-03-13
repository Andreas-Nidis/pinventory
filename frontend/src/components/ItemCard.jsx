import { Link } from 'react-router-dom';
import { EditIcon, Trash2Icon } from 'lucide-react';
import React from 'react'
import { useItemStore } from '../store/useItemStore.js';

function ItemCard({item}) {
  const { deleteItem } = useItemStore()
  return (
    <div className='card bg-base-300 shadow-xl hover:shadow-2xl transition-shadow duration-300'>

      {/* Item Image */}
      <figure className='relative pt-[56.25%]'>
        <img 
          src={item.image}
          alt={item.name}
          className='absolute top-0 left-0 w-full h-full object-cover'
        />
      </figure>

      <div className='card-body'>
        {/* Item Information */}
        <h2 className='card-title text-lg font-semibold'>{item.name}</h2>
        <p className='card-title text-sm font-semibold'>{item.description}</p>
        {Number(item.value).toFixed(2) === "0.00" ?
          ""
          :
          <p className='text-2xl font-bold text-primary'>${Number(item.value).toFixed(2)}</p>
        }
        
        {/* Card Actions */}
        <div className='flex card-actions justify-end'>
          <Link to={`/item/${item.id}`} className='pr-2 btn btn-sm btn-info btn-outline'>
            <EditIcon className='size-5' />
          </Link>

          <button className='btn btn-sm btn-error btn-outline' onClick={() => deleteItem(item.id)}>
            <Trash2Icon className='size-5' />
          </button>
        </div>
      </div>

    </div>
  )
}

export default ItemCard