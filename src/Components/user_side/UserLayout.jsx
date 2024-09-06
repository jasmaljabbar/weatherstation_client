import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const UserLayout = () => {
  return (
    <div className="pt-20">
      <Navbar />

      <div className="">
        <Outlet  />
      </div>
    </div>
  );
};

export default UserLayout;
