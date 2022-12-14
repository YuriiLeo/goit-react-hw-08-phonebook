import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const isDublicate = ({ name, number }, contacts) => {
    const normalizedName = name.toLowerCase();
    const normalizedPhone = number.toLowerCase();

    const result = contacts.find((item) => {
        return (normalizedName === item.name.toLowerCase() && item.number.toLowerCase() === normalizedPhone);
    });
        return Boolean(result);
};

export const fetchContacts = createAsyncThunk(
    "contacts/fetchAll",
    async (_, thunkAPI) => {
    try {
        const { data } = await axios.get("/contacts");
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addContact = createAsyncThunk(
    "contacts/add",
    async (contact, thunkAPI) => {
    try {
        const response = await axios.post(
            "/contacts", contact);
        
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
    },
        {
        condition: (data, { getState }) => {
        const { contacts } = getState();
            if (isDublicate(data, contacts.items)) {
            const mesage = toast.warn(`${data.name}  is already in contacts.`, {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
               });
                return mesage(data);
            }
        }
    },
);

export const deleteContact = createAsyncThunk(
    "contacts/delete",
    async (contactID, thunkAPI) => {
    try {
        const response = await axios.delete(
            `/contacts/${contactID}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
    },
);


