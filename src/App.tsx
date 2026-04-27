import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import PizzaLab from "./pages/PizzaLab"
import OurRoots from "./pages/OurRoots"
import FindUs from "./pages/FindUs"
import Checkout from "./pages/Checkout"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lab" element={<PizzaLab />} />
          <Route path="/roots" element={<OurRoots />} />
          <Route path="/find-us" element={<FindUs />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App
