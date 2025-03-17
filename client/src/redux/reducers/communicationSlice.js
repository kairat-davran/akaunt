import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socket: null,
  peer: null,
};

export const communicationSlice = createSlice({
    name: 'communication',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setPeer: (state, action) => {
            state.peer = action.payload;
        },
    },
});

export const { setSocket, setPeer } = communicationSlice.actions;

export default communicationSlice.reducer;
