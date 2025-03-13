import React from 'react'
import { useItemStore } from '../store/useItemStore.js';
import { DollarSignIcon, ImageIcon, Package2Icon, PlusCircleIcon } from 'lucide-react';

function AddItemModal() {
    const {addItem, formData, setFormData, loading} = useItemStore();

  return (
    <dialog id='add_item_modal' className='modal'>
        <div className='modal-box'>
            <form method='dialog'>
                <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
            </form>

            <h3 className='font-bold text-xl mb-8'>Add New Item</h3>

            <form onSubmit={addItem} className='space-y-6'>
                <div className='grid gap-6'>

                    {/* Name */}
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text text-base font-medium'>Item Name</span>
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                                <Package2Icon className='size-5' />
                            </div>
                            <input 
                                type='text' 
                                placeholder='Enter item name' 
                                className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200' 
                                value={formData.name} 
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text text-base font-medium'>Item Description</span>
                            <span className='label-text-alt text-base-content/50 font-light'>(optional)</span>
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                                <Package2Icon className='size-5' />
                            </div>
                            <input 
                                type='text' 
                                placeholder='Enter item description (e.g. location, significance, etc.)'
                                className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200' 
                                value={formData.description ?? ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                            />
                        </div>
                    </div>

                    {/* Value */}
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text text-base font-medium'>Estimated Value</span>
                            <span className='label-text-alt text-base-content/50 font-light'>(optional)</span>
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                                <DollarSignIcon className='size-5' />
                            </div>
                            <input 
                                type='number' 
                                min="0"
                                step="0.01"
                                placeholder='0.00' 
                                className='input input-bordered w-full pl-10 py-3 focus:input-primary transition-colors duration-200' 
                                value={formData.value} 
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })} 
                            />
                        </div>
                    </div>

                    {/* Image */}
                    <div className='form-control'>
                        <label className='label'>
                            <span className='label-text text-base font-medium'>Image URL</span>
                        </label>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50'>
                                <ImageIcon className='size-5' />
                            </div>
                            <input 
                                type='file' 
                                accept='image/*'
                                className='input input-bordered w-full pl-10 py-2 focus:input-primary transition-colors duration-200' 
                                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className='modal-action'>
                    <button 
                        type='button'
                        className='btn btn-ghost'
                        onClick={() => document.getElementById('add_item_modal').close()}
                    >
                        Cancel
                    </button>
                    <button 
                        type='submit'
                        className='btn btn-primary min-w-[120px]'
                        disabled={!formData.name || !formData.image || loading}
                    >
                        {loading ? (
                            <span className='loading loading-spinner loading-sm' />
                        ) : (
                            <>
                                <PlusCircleIcon className='size-5 mr-2' />
                                Add Item
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>

        {/* Backdrop */}
        <form method='dialog' className='modal-backdrop'>
            <button>close</button>
        </form>
    </dialog>
  )
}

export default AddItemModal