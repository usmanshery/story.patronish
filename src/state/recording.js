import { createSlice } from '@reduxjs/toolkit';

const recordingSlice = createSlice( {
	name: 'recording_slice',
    slice: 'recording',
    initialState: {
        url: null,
        objectName: null,
        contentType: null,
        extension: null,
        status: 'waiting',
        rawData: null
    },
    reducers: { // i.e. action handlers
        update: (state, action) => ({ ...state,
            ...action.payload
        })
    }
});

export const {
    actions,
    reducer
} = recordingSlice;

export default reducer;