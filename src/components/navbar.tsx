"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Work", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
    >
      <nav className="glass rounded-full px-6 py-3 flex items-center justify-between w-full max-w-4xl shadow-lg shadow-primary/5">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl tracking-tighter hover:text-primary transition-colors duration-300">
          Zidane<span className="text-primary">.</span>dev
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="absolute top-20 left-4 right-4 p-4 glass rounded-2xl md:hidden flex flex-col gap-4 shadow-2xl origin-top"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
