import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
	name:'customer_slice',
    slice: 'customer',
    initialState: {
        name: 'Jon Doe',
        email: 'customer@jondoe.com'
    },
    reducers: {
        addCustomer: (state, action) => ({ ...state,
            ...action.payload
        }),
    }
});

export const {
    actions,
    reducer
} = customerSlice;
export default reducer;