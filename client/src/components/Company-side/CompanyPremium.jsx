import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import Axios from 'axios';
import { CompanyApi } from '../../APIs/api';
import {useLocation} from 'react-router-dom';
import Navbar from './Navbar';


const CompanyPremium = () => {
  const amount = 1000; 
  const publishableKey = 'pk_test_51NnZNQSCHRF9RPPWsxW5yF4ncPLLrR1Rc2svGQE5sK7DmkYyq47cRGIl1Yt5IwSwQyv4733qE0wxt4fCguIykQz300vFWMcSuW'; 
  const location = useLocation()

  const payNow = async (token,amount) => {
    try {
      Axios.post(`${CompanyApi}company-payment`,{
        token:token.id,
        amount:amount.toString(),
        currency:"INR",
        data :location?.state.data

      }).then((res)=>{
        if(res.status===200){
           window.open(res.data.data,"_blank")
           navigate('/company/company-login')
           const showToast = () => {
             toast.success(res.data.message, {
               duration: 3000,
               position: 'top-center',
               style: {
                 background: '#00ff00',
                 color: '#fff',
               },
             });
           };
           showToast()
 
        }else{
            console.log("Invalid OTP");
            toast.error(res.data.message,{
              duration:3000,
              position:'top-center',
              style:{
                background:'#ff0000',
                color:'#fff'
              }
            })
  
        }
      })
    
     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className='flex justify-center'>
        <div className=' bg-pink-100 w-6/12 p-6 mt-24'>
            <h1 className='text-center text-2xl font-bold mb-4'>Unlock the Full Potential of SkillSet Network!</h1>
            <p>Upgrade to our Premium Company Account for 9 months and supercharge your hiring process.<br/>
            With Premium, your company gains exclusive access to a powerful suite of features and benefits:</p><br />
            <ul className='ml-11 list-disc'>
                <li>Post unlimited job listings to reach a wider talent pool.</li>
                <li>Highlight your company's profile to attract top-tier candidates.</li>
                <li>Advanced search filters to find the perfect match for your team.</li>
                <li>Premium badge to boost your company's credibility.</li>
            </ul><br />
            <p>Invest in your company's growth and hire the best talent effortlessly. Join SkillSet Network Premium <br />
                today and discover the future of recruitment!</p><br />
                <div className='flex justify-center'>
            <StripeCheckout
            stripeKey={publishableKey}
            token={(token) => payNow(token, amount)}
            name='Premium Registration'
            description='Your company registration'
            amount={amount * 100} 
            currency='INR'
            billingAddress
            zipCode
            image='/skillset-logo.jpg'
            >
            <button className='bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded'>
                Pay Now
            </button>
            </StripeCheckout>
            </div>
        </div>
  </div>
  </>
  );
};

export default CompanyPremium;
