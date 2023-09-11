import {createSlice} from '@reduxjs/toolkit';

const Company = createSlice({
    name:"company",
    initialState: {
        companyToken : null,
        companyRole : null,
        companyName : null,
    },
    reducers: {
        companyDetails(state , action){
            const newData = action.payload
            state.companyToken = newData.token;
            state.companyRole = newData.role;
            state.companyName = newData.company
        },
        companyLogout(state){
            state.companyToken = null
            state.companyRole = null
            state.companyName = null
        }
    }
})

export const {companyDetails, companyLogout} = Company.actions;
export default Company.reducer;