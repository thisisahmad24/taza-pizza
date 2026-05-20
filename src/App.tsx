import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import PizzaLab from "./pages/PizzaLab"
import OurRoots from "./pages/OurRoots"
import FindUs from "./pages/FindUs"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import OrderTracker from "./pages/OrderTracker"
import Menu from "./pages/Menu"
function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/lab" element={<PizzaLab />} />
          <Route path="/roots" element={<OurRoots />} />
          <Route path="/find-us" element={<FindUs />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tracker" element={<OrderTracker />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App
