import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import Test from "./components/tests/test";
import Admin from "./components/admin/admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path={"/login"} element={<Login />} />
        <Route path={"/sorovnoma"} element={<Test />} />
        <Route path={"/admin"} element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
