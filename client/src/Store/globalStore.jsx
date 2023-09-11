import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import SeekerAuth from './storeSlices/seekerAuth';
import CompanyAuth from './storeSlices/companyAuth';
import AdminAuth from './storeSlices/adminAuth';

const rootReducer = combineReducers({
    seekerDetails:SeekerAuth,
    companyDetails:CompanyAuth,
    adminDetails:AdminAuth
})

const store = configureStore({
    reducer:rootReducer
})

export default store