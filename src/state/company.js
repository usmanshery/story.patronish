import { createSlice } from '@reduxjs/toolkit';

const companySlice = createSlice({
	name: 'company_slice',
    slice: 'company',
    initialState: {
        name: 'Casper',
        question: 'Record a short video telling us what you like about your new Casper mattress. 🙌 Hit record when ready 👇🔴'
    },
    reducers: {
        addCompany: (state, action) => ({ ...state,
            ...action.payload
        }),
    }
});

export const {
    actions,
    reducer
} = companySlice;
export default reducer;