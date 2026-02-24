"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { motion } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export const lenderNames = [
    { name: "ABFL", logo: "/ABFL.png" },
    { name: "Axis", logo: "/axis.png" },
    { name: "Bajaj Finance", logo: "/bajajFinance.png" },
    { name: "Bajaj Market", logo: "/bajajMarket.png" },
    { name: "Chola", logo: "/chola.png" },
    { name: "Credit Saison", logo: "/creditSaison.png" },
    { name: "Godrej", logo: "/godrej.webp" },
    { name: "HDFC Bank", logo: "/HDFC.png" },
    { name: "ICICI", logo: "/ICICI.png" },
    { name: "IDFC", logo: "/IDFC.png" },
    { name: "IndusInd", logo: "/IndusInd.jpg" },
    { name: "Lending Cart", logo: "/Lendingkart.webp" },
    { name: "LNT", logo: "/lnt.png" },
    { name: "PaySense", logo: "/paysense.jpg" },
    { name: "Shriram", logo: "/sriram.jpg" },
    { name: "Tata", logo: "/Tata.jpg" },
    { name: "InCred", logo: "/placeholder.svg?height=60&width=120&text=InCred" },
]

export function LendersCarousel() {
    const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }))

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
            breakpoints: {
                "(min-width: 768px)": { slidesToScroll: 2 },
                "(min-width: 1024px)": { slidesToScroll: 3 },
            },
        },
        [autoplay.current],
    )

    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true)
        if (autoplay.current) {
            autoplay.current.stop()
        }
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false)
        if (autoplay.current) {
            autoplay.current.play()
        }
    }, [])

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi, onSelect])

    return (
        <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-blue/10" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(0, 122, 255, 0.1) 0%, transparent 50%)`,
                    }}
                />
            </div>

            {/* Main Carousel Container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/50 via-gray-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold via-blue to-gold" />

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-gold/40 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 0.8, 0],
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Header */}
                <div className="relative z-10 text-center py-8 px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-3 mb-4"
                    >
                        <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                        <span className="text-gold font-semibold text-sm uppercase tracking-wider">Trusted Partners</span>
                        <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                    </motion.div>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-bold text-white mb-2"
                    >
                        Leading Financial Institutions
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-sm"
                    >
                        Partner with India's most trusted banks and NBFCs
                    </motion.p>
                </div>

                {/* Carousel */}
                <div className="relative px-6 pb-8">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4">
                            {lenderNames.map((lender, index) => (
                                <motion.div
                                    key={index}
                                    className="flex-[0_0_280px] md:flex-[0_0_320px]"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="group relative h-32 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-gold/30 transition-all duration-500 overflow-hidden cursor-pointer"
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}>
                                        {/* Hover Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                        {/* Logo Container */}
                                        <div className="relative z-10 h-full flex items-center justify-center p-6">
                                            <div className="relative">
                                                <Image
                                                    src={lender.logo || "/placeholder.svg?height=60&width=120&text=" + lender.name}
                                                    alt={lender.name}
                                                    width={120}
                                                    height={70}
                                                    className="object-contain filter brightness-90 group-hover:brightness-110 group-hover:scale-110 transition-all duration-500"
                                                />

                                                {/* Logo Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-blue/20 rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />
                                            </div>
                                        </div>

                                        {/* Bottom Accent */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollPrev}
                            disabled={prevBtnDisabled}
                            className="w-12 h-12 rounded-full bg-white/5 border-white/20 hover:bg-gold/20 hover:border-gold/40 disabled:opacity-30 transition-all duration-300"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </Button>

                        {/* Dots Indicator */}
                        <div className="flex space-x-2">
                            {Array.from({ length: Math.ceil(lenderNames.length / 3) }).map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === Math.floor(selectedIndex / 3) ? "bg-gold w-6" : "bg-white/30 hover:bg-white/50"
                                        }`}
                                    onClick={() => emblaApi?.scrollTo(index * 3)}
                                />
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={scrollNext}
                            disabled={nextBtnDisabled}
                            className="w-12 h-12 rounded-full bg-white/5 border-white/20 hover:bg-gold/20 hover:border-gold/40 disabled:opacity-30 transition-all duration-300"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </Button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="relative border-t border-white/10 bg-gradient-to-r from-slate-800/30 to-gray-900/30 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-8 py-4 px-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gold">{lenderNames.length}+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Partners</div>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue">₹500Cr+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Disbursed</div>
                        </div>
                        <div className="w-px h-8 bg-white/20" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">99.9%</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
