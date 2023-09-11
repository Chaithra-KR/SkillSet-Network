import {createSlice} from '@reduxjs/toolkit';

const Admin = createSlice({
    name:"admin",
    initialState: {
        adminToken : null,
        adminRole : null,
    },
    reducers: {
        adminDetails(state , action){
            const newData = action.payload
            state.adminToken = newData.token;
            state.adminRole = newData.role;
        },
        adminLogout(state){
            state.adminToken = null
            state.adminRole = null
        }
    }
})

export const {adminDetails, adminLogout} = Admin.actions;
export default Admin.reducer;