import {createSlice} from '@reduxjs/toolkit';

const Admin = createSlice({
    name:"admin",
    initialState: {
        adminToken : null,
        adminId : null,
        adminName : null,
    },
    reducers: {
        adminLogin(state , action){
            const newData = action.payload
        },
        adminLogout(){

        }
    }
})