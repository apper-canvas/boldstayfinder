import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PropertyComparison from "@/components/pages/PropertyComparison";
import Help from "@/components/pages/Help";
import Wishlist from "@/components/pages/Wishlist";
import PropertyDetail from "@/components/pages/PropertyDetail";
import Home from "@/components/pages/Home";
import Search from "@/components/pages/Search";
import Header from "@/components/organisms/Header";
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/explore" element={<Search />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/compare" element={<PropertyComparison />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;