import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  disabled = false,
  className = "" 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && !event.target.closest('.custom-select-menu')) {
        setIsOpen(false);
      }
    };
    
    const handleScroll = (event) => {
      if (event.target && event.target.classList && event.target.classList.contains('custom-select-menu')) {
        return;
      }
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleScroll);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuMaxHeight = 240;
      
      let style = {
        position: 'fixed',
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      };

      if (spaceBelow < menuMaxHeight && spaceAbove > spaceBelow) {
        style.bottom = window.innerHeight - rect.top + 6;
      } else {
        style.top = rect.bottom + 6;
      }

      setMenuStyle(style);
    }
    setIsOpen(!isOpen);
  };

  const selectedOption = options.find(opt => 
    typeof opt === 'string' ? opt === value : opt.value === value
  );
  
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label) 
    : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={toggleMenu}
        className={`flex items-center justify-between w-full text-left ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`truncate mr-2 ${!selectedOption && !value ? 'text-muted/60' : 'text-ink'}`}>
          {displayLabel}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && createPortal(
        <div 
          className="custom-select-menu py-1.5 bg-white border border-rule/60 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto"
          style={menuStyle}
        >
          {options.map((opt, idx) => {
            const isStr = typeof opt === 'string';
            const optVal = isStr ? opt : opt.value;
            const optLabel = isStr ? opt : opt.label;
            const isSelected = optVal === value;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] font-sans text-ink hover:bg-cream-dark transition-colors cursor-pointer text-left"
              >
                <span className={`truncate ${isSelected ? 'font-bold' : ''}`}>{optLabel}</span>
                {isSelected && <Check size={14} className="text-lime-dark shrink-0" />}
              </button>
            );
          })}
          {options.length === 0 && (
            <div className="px-3.5 py-3 text-[13px] text-muted/60 text-center italic">No options</div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
