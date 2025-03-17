import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

//Dynamic BASE_URL depending on environment
const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:3000' : "";

export const useItemStore = create((set, get) => ({
    //Items state
    items: [],
    loading: false,
    error: null,
    currentitem: null,

    //Form state
    formData: {
        name: "",
        description: "",
        value: "0.00",
        image: "",
    },

    setFormData: (formData) => set({ formData }),
    resetForm: () => set({ formData: { name: "", description: "", value: "0.00", image: "" }}),
    
    addItem: async(e) => {
        e.preventDefault();
        set({ loading: true });

        try {
            const { formData } = get();
            const token = localStorage.getItem('token');

            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("value", formData.value);
            formDataToSend.append("imageFile", formData.image);

            await axios.post(`${BASE_URL}/api/products/items`, formDataToSend, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });

            await get().fetchItems();
            get().resetForm();
            toast.success("Item added successfully");
            document.getElementById('add_item_modal').close();
        } catch (error) {
            console.log("Error in addItem function", error);
            toast.error("Something went wrong");
        } finally {
            set({ loading: false });
        }
    },

    fetchItems: async () => {
        set({loading:true});
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/products/items`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            set({items:response.data.data, error:null});
        } catch (err) {
            if (err.status === 429) set({error:"Rate Limit Exceeded", items:[]});
            else set({error:"Something went wrong", items:[]});
        } finally {
            set({loading:false});
        }
    },

    deleteItem: async (id) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/products/items/${id}`, {
                headers: {"Authorization": `Bearer ${token}`}
            });
            set(prev => ({ items: prev.items.filter(item => item.id !== id)}));
            toast.success("Item deleted successfully");
        } catch (error) {
            console.log("Error in deleteItem function", error);
            toast.error("Something went wrong");
        } finally {
            set({ loading: false });
        }
    },

    fetchItem: async (id) => {
        set({ loading: true });
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/products/items/${id}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            set({ 
                currentItem: response.data.data, 
                formData: response.data.data, //Prefill form with current values 
                error: null
             });
        } catch (error) {
            console.log("Error in fetchItem function", error);
            set({ error: "Something went wrong", currentItem: null});
        } finally {
            set({ loading: false });
        }
    },

    updateItem: async (id) => {
        set({loading:true})
        try {
            const {formData} = get();
            const token = localStorage.getItem('token');

            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("value", formData.value);
            formDataToSend.append("imageFile", formData.image);

            const response = await axios.put(`${BASE_URL}/api/products/items/${id}`, formDataToSend, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            set({ currentItem: response.data.data});
            toast.success("Item updated successfully");
        } catch (error) {
            toast.error("Something went wrong");
            console.log("Error in updateItem function", error);
        } finally {
            set({loading:false});
        }
    },
}));