import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HelpModal from './components/HelpModal';
import Home from './pages/Home';

export default function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9FAF8] text-[#181C1A]">
        <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      </div>
    </BrowserRouter>
  );
}