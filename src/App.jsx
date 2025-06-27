import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomeRoute } from "@/routes/HomeRoute";
import { AddBookRoute } from "@/routes/AddBookRoute";
import { Navbar } from "@/components/Navbar";

function App() {
  return (
    <BrowserRouter>
      
      <Navbar />

     
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/add" element={<AddBookRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;