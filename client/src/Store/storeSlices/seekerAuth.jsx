import {createSlice} from '@reduxjs/toolkit';

const Seeker = createSlice({
    name:"seeker",
    initialState: {
        seekerToken : null,
        seekerRole : null,
        seekerName : null,
    },
    reducers: {
        seekerDetails(state , action){
            const newData = action.payload
            state.seekerToken = newData.token;
            state.seekerRole = newData.role;
            state.seekerName = newData.username
        },
        seekerLogout(state){
            state.seekerToken = null
            state.seekerRole = null
            state.seekerName = null
        }
    }
})

export const {seekerDetails, seekerLogout} = Seeker.actions;
export default Seeker.reducer;