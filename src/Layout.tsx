import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './components/Navbar.tsx'

export const Layout = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#121220] via-[#2a2a49] to-[#121220] relative overflow-hidden">
            <div 
                className="absolute inset-0 pointer-events-none" 
                style={{
                    backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                    opacity: 0.3,
                }}
            />
            <Navbar />
            <div className="relative">
                <Outlet />
            </div>
        </div>
    )
}
