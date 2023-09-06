import React,{Fragment} from 'react';
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom';
import User from './Router/User';
import Admin from './Router/Admin';
import Company from './Router/Company';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <Fragment>
      <Toaster/>
      <Router>
        
        <Routes>
          <Route path='/*' element={<User/>}/>

          <Route path='/admin*' element={<Admin/>}/>

          <Route path='/company*' element={<Company/>}/>
        </Routes>

      </Router>
      
    </Fragment>
  );
}

export default App;
