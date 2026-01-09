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
      
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-black/10 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-xl font-light tracking-tight text-black">MUSEDATA</a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
             <Link href="#reports" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Reports</Link>
              <Link href="#insights" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Insights</Link>
              <Link href="/dashboard/billing" className="text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black">Pricing</Link>
              
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
              className="md:hidden p-2 text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
      <div className="md:hidden border-t border-black/10 bg-white">
  <div className="px-6 py-8 space-y-6">
    <Link 
      href="#reports" 
      className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
    >
      Reports
    </Link>
    <Link 
      href="#insights" 
      className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
    >
      Insights
    </Link>
    <Link 
      href="/dashboard/billing" 
      className="block text-sm tracking-wide uppercase hover:opacity-60 transition-opacity text-black"
    >
      Pricing
    </Link>
    
    <div className="pt-4">
      <Unauthenticated>
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <Button className="w-full h-12 bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase transition-all duration-300">
            Get Started
          </Button>
        </SignInButton>
      </Unauthenticated>
      
      <Authenticated>
        <a href="/dashboard" className="block">
          <Button className="w-full h-12 bg-black text-white hover:bg-white hover:text-black border-2 border-black text-xs tracking-widest uppercase transition-all duration-300">
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