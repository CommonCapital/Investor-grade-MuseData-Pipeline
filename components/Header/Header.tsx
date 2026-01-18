'use client'
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ModeToggle } from '../ThemeToggle/ThemeToggle'
import Link from 'next/link'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
      
         <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/">
              <svg width="40" height="40" viewBox="0 0 100 100">
                <rect x="10" y="10" width="22" height="22" fill="#2D5F73"/>
                <rect x="39" y="10" width="22" height="22" fill="#1C4E64"/>
                <rect x="68" y="10" width="22" height="22" fill="#3A7A94"/>
                <rect x="10" y="39" width="22" height="22" fill="#2D5F73"/>
                <rect x="39" y="39" width="22" height="22" fill="#245167"/>
                <rect x="68" y="39" width="22" height="22" fill="#0F2B3A"/>
                <rect x="10" y="68" width="22" height="22" fill="#2D5F73"/>
                <rect x="39" y="68" width="22" height="22" fill="#245167"/>
                <circle cx="79" cy="79" r="11" fill="#000000"/>
              </svg>
            
              <span  className="text-xl font-bold text-[#1C4E64]">MUSEDATA</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#what-we-do" className="text-[#1C4E64] font-medium hover:underline">
                What We Do
              </Link>
              <Link href="#services" className="text-[#1C4E64] font-medium hover:underline">
                Services
              </Link>
              <Link href="/dashboard/billing" className="text-[#1C4E64] font-medium hover:underline">
                Pricing
              </Link>
              
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button 
                    size="sm"
                    className="h-10 px-6 bg-[#1C4E64] text-white hover:bg-[#163B4F] transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/dashboard">
                  <Button 
                    size="sm"
                    className="h-10 px-6 bg-[#1C4E64] text-white hover:bg-[#163B4F] transition-all duration-300"
                  >
                    Dashboard
                  </Button>
                </a>
                <UserButton />
              </Authenticated>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-[#1C4E64]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-6 py-4 space-y-4">
              <Link 
                href="#what-we-do"
                className="block text-[#1C4E64] font-medium hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                What We Do
              </Link>
              <Link 
                href="#services"
                className="block text-[#1C4E64] font-medium hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/dashboard/billing"
                className="block text-[#1C4E64] font-medium hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              
              <div className="pt-4">
                <Unauthenticated>
                  <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                    <Button className="w-full bg-[#1C4E64] text-white hover:bg-[#163B4F] transition-all duration-300">
                      Get Started
                    </Button>
                  </SignInButton>
                </Unauthenticated>
                
                <Authenticated>
                  <a href="/dashboard" className="block">
                    <Button className="w-full bg-[#1C4E64] text-white hover:bg-[#163B4F] transition-all duration-300">
                      Dashboard
                    </Button>
                  </a>
                </Authenticated>
              </div>
            </div>
          </div>
        )}
      </header>

  )
}

export default Header