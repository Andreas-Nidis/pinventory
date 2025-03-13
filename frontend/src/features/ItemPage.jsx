import React, { useEffect } from 'react'
import { useItemStore } from '../store/useItemStore.js';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from 'lucide-react';

function ItemPage() {
  const {
    currentItem,
    formData,
    setFormData,
    loading,
    error,
    fetchItem,
    updateItem,
    deleteItem,
  } = useItemStore();
  const navigate = useNavigate();
  const {id} = useParams();

  useEffect(() => {
    fetchItem(id)
  }, [fetchItem, id])

  const handleDelete = async () => {
    if(window.confirm("Are you sure you want to delete this item?")) {
      await deleteItem(id);
      navigate("/");
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='loading loading-spinner loading-lg' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='alert alert-error'>{error}</div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <button onClick={() => navigate("/")} className='btn btn-ghost mb-8'>
        <ArrowLeftIcon className='size-4 mr-2' />
        Back to Items
      </button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Item Image */}
        <div className='rounded-lg overflow-hidden sha bg-base-100'>
          <img 
            src={currentItem?.image}
            alt={currentItem?.name}
            className='size-full object-cover'
          />
        </div>

        {/* Form */}
        <div className='card bg-base-100 shadow-lg'>
          <div className='card-body'>
            <h2 className='card-title text-2xl mb-6'>Edit Item</h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              updateItem(id);
            }} 
            className='space-y-6'>
              {/* Item Name */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Item Name</span>
                </label>
                <input 
                  type='text'
                  placeholder='Enter item name'
                  className='input input-bordered w-full'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Item Description */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Item Description</span>
                  <span className='label-text-alt text-base-content/50 font-light'>(optional)</span>
                </label>
                <input 
                  type='text'
                  
                  placeholder='Enter item description (e.g. location, history, significance, etc.)'
                  className='input input-bordered w-full'
                  value={formData.description ?? ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Item Value */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Item Value</span>
                  <span className='label-text-alt text-base-content/50 font-light'>(optional)</span>
                </label>
                <input 
                  type='number'
                  min='0'
                  step='0.01'
                  placeholder='Enter item value'
                  className='input input-bordered w-full'
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>

              {/* Item Image URL */}
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text text-base font-medium'>Image URL</span>
                </label>
                <input 
                  type='file' 
                  accept='image/*'
                  className='input input-bordered w-full py-2 focus:input-primary transition-colors duration-200' 
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
                />
              </div>

              {/* Form Actions */}
              <div className='flex justify-between mt-8'>
                <button type='button' onClick={handleDelete} className='btn btn-error'>
                  <Trash2Icon className='size-4 mr-2' />
                  Delete Item
                </button>

                <button 
                  type='submit'
                  className='btn btn-primary'
                  disabled={loading || !formData.name || !formData.image}
                >
                  {loading ? (
                    <span className='loading loading-spinner loading-sm' />
                  ) : (
                    <>
                      <SaveIcon className='size-4 mr-2' />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ItemPage