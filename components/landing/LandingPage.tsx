"use client"

import Navbar from "./Navbar"
import Footer from "./Footer"

export function LandingPage() {

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <Navbar />
            <div>
                This is LandingPage
            </div>
            <Footer />
        </div>
    )
}

export default LandingPage
