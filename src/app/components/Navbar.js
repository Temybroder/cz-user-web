
"use client";
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/components/ui/dropdown-menu";
import { Button } from "@/app/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center h-16">
        {/* Logo */}
        <Link href="/" className="z-50">
          <Image
            src="/images/logo.png"
            alt="Conzooming"
            width={160}
            height={35}
            className="hover:scale-105 transition-transform"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
              Partner with us <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mt-2 min-w-[200px]">
              <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer p-3">
                <Link href="/partners" className="w-full">
                  Partner with us
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-primary/10 cursor-pointer p-3">
                <Link href="/riders" className="w-full">
                 Become a Rider
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" className="text-gray-700 hover:text-primary" asChild>
            <Link href="/about">About Us</Link>
          </Button>

          <Button className="bg-primary hover:bg-primary/90 text-white px-6 shadow-lg hover:shadow-primary/30 transition-all">
             <Link href="/home"> Get Started </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden fixed inset-0 bg-white transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} pt-20 px-6`} style={{ top: '4rem' }}>
          <div className="flex flex-col gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full flex justify-between items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg">
                Partner with us <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                <DropdownMenuItem className="p-3 hover:bg-primary/10">
                  Partner with us
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 hover:bg-primary/10">
                  Become a Rider
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" className="w-full justify-start p-3 text-gray-700 hover:bg-gray-50" asChild>
              <Link href="/about">About Us</Link>
            </Button>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white mt-4">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}