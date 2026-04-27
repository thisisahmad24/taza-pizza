import { Routes, Route } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./pages/Home"
import PizzaLab from "./pages/PizzaLab"
import OurRoots from "./pages/OurRoots"
import FindUs from "./pages/FindUs"

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
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
