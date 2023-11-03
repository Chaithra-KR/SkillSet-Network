import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray-100 py-10 px-4 md:px-32 mt-20 md:mt-0">
      <div className="container mx-auto flex flex-wrap justify-between md:flex-row sm:flex-col">
        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h1 className="font-bold text-lg">For Talents</h1>
          <ul className="mt-3">
            <li>How to Find Job</li>
            <li>Details</li>
            <li>Events</li>
            <li>All Jobs</li>
          </ul>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h1 className="font-bold text-lg">For Companies</h1>
          <ul className="mt-3">
            <li>How to Hire</li>
            <li>Talent marketplace</li>
            <li>Hire Worldwide</li>
            <li>All Jobs</li>
          </ul>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h1 className="font-bold text-lg">Resources</h1>
          <ul className="mt-3">
            <li>Help & Support</li>
            <li>Success Stories</li>
          </ul>
        </div>

        <div className="w-full sm:w-1/2 md:w-1/4 mb-8">
          <h1 className="font-bold text-lg">SkillSet Network</h1>
          <ul className="mt-3">
            <li>About Us</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Safety & Security</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
