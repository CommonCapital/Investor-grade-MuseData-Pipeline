'use client'
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { ArrowRight, Menu, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ModeToggle } from '../ThemeToggle/ThemeToggle'

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
      
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-black/10 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-light tracking-tight text-black/60">MUSEDATA</div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#reports" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black/60">Reports</a>
              <a href="#insights" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black/60">Insights</a>
              <a href="#pricing" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black/60">Pricing</a>
              
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button 
                    size="sm"
                    className="h-10 px-6 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase"
                  >
                    Get Started
                  </Button>
                </SignInButton>
              </Unauthenticated>

              <Authenticated>
                <a href="/dashboard">
                  <Button 
                    size="sm"
                    className="h-10 px-6 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-all duration-300 text-xs tracking-widest uppercase"
                  >
                    Dashboard
                  </Button>
                </a>
                <UserButton  />
              </Authenticated>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/10 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#reports" className="block text-sm tracking-wide uppercase">Reports</a>
              <a href="#insights" className="block text-sm tracking-wide uppercase">Insights</a>
              <a href="#pricing" className="block text-sm tracking-wide uppercase">Pricing</a>
              <Unauthenticated>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase">
                    Get Started
                  </Button>
                </SignInButton>
              </Unauthenticated>
              <Authenticated>
                <a href="/dashboard" className="block">
                  <Button className="w-full bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase">
                    Dashboard
                  </Button>
                </a>
              </Authenticated>
            </div>
          </div>
        )}
      </header>

  )
}

export default Header