import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "EXPÉRIENCES", id: "experiences" },
    { label: "ACTIVITÉS", id: "activities" },
    { label: "CORPORATE", id: "corporate" },
    { label: "CONTACT", id: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EE] border-b border-[#E8E0D5]/60 px-6 py-5 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo - Styled strictly matching the original design */}
       <div 
  onClick={() => onNavigate("home")} 
  className="cursor-pointer group flex flex-col"
  id="brand-logo"
>
  <img
    src="/assets/logo.png"
    alt="Trippin Babi"
  className="h-16 md:h-20 object-contain hover:opacity-80 transition"
  />

</div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10" id="desktop-nav">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`text-xs font-semibold tracking-[0.2em] font-sans hover:text-[#9A6F4C] transition-colors duration-300 relative py-1 ${
                currentView === link.id ? "text-[#9A6F4C]" : "text-[#352115]"
              }`}
            >
              {link.label}
              {currentView === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#9A6F4C]" />
              )}
            </button>
          ))}
          
          <button
            onClick={() => onNavigate("admin")}
            className={`p-1.5 rounded-full hover:bg-[#E8E0D5]/40 transition-colors ${
              currentView === "admin" ? "text-[#9A6F4C]" : "text-[#352115]/70 hover:text-[#352115]"
            }`}
            title="Console Admin"
            id="admin-btn"
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={() => onNavigate("admin")}
            className="p-1.5 text-[#352115]/80 hover:text-[#9A6F4C] transition-colors"
            title="Console Admin"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#352115] focus:outline-none p-1"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in/Dropdown Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-[#FAF6EE] border-b border-[#E8E0D5] px-6 py-6 flex flex-col space-y-5 shadow-sm slide-in">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setIsOpen(false);
              }}
              className={`text-left text-sm font-bold tracking-[0.15em] py-2 border-b border-[#E8E0D5]/40 hover:text-[#9A6F4C] transition-colors ${
                currentView === link.id ? "text-[#9A6F4C]" : "text-[#352115]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
