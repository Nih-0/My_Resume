import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import BootLoader from './pages/BootLoader';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import Cursor from './components/Cursor';
import Overlays from './components/Overlays';

function App() {
  const location = useLocation();

  return (
    <>
      <Cursor />
      <Overlays />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<BootLoader />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
