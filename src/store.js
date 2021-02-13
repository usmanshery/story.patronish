import { configureStore } from '@reduxjs/toolkit';
import recordingReducer from './state/recording';
import companyReducer from './state/company';
import customerReducer from './state/customer';

const store = configureStore({
    reducer: {
        recording: recordingReducer,
        company: companyReducer,
        customer: customerReducer
    }
});

export default store;