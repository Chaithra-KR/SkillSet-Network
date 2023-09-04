import React from 'react';

const Footer = () => {
  return (
      <div className="h-80 w-full flex justify-between px-32 bg-gray-100 pt-10">
        <div>
            <ul>
                <li><h1 style={{fontWeight:"bold"}}>For Talents</h1></li>
                <li className='pt-3'>How to Find Job</li>
                <li>Details</li>
                <li>Events</li>
                <li>All Jobs</li>
            </ul>
        </div>

        <div>
            <ul>
                <li><h1 style={{fontWeight:"bold"}}>For TalentsFor Companies</h1></li>
                <li className='pt-3'>How to Hire</li>
                <li>Talent marketplace</li>
                <li>Hire Worldwide</li>
                <li>All Jobs</li>
            </ul>
        </div>

        <div>
            <ul>
                <li><h1 style={{fontWeight:"bold"}}>Resources</h1></li>
                <li className='pt-3'>Help & Support</li>
                <li>Success Stories</li>
            </ul>
        </div>

        <div>
            <ul>
                <li><h1 style={{fontWeight:"bold"}}>SkillSet Network</h1></li>
                <li className='pt-3'>About Us</li>
                <li>Careers</li>
                <li>Contact Us</li>
                <li>Safety & Security</li>
            </ul>
        </div>

      </div>
  );
}

export default Footer;
