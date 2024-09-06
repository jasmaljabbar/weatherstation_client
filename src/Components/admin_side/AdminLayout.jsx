import React from "react";
import { Outlet } from "react-router-dom";
import Navbar_admin from "./Navbar_admin";

const AdminLayout = () => {
  return (
    <div className="pt-20">
      <Navbar_admin />

      <div className="">
        <Outlet  />
      </div>
    </div>
  );
};

export default AdminLayout;
