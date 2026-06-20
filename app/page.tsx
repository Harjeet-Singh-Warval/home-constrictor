'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import { 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Send, 
  Star, 
  X, 
  Loader2, 
  Layers, 
  Compass, 
  Home as HomeIcon, 
  Maximize2, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  Flame, 
  Compass as CompassIcon,
  HardHat,
  Sun,
  ShieldCheck,
  Grid3X3,
  Menu,
  Phone,
  Mail
} from "lucide-react";

// Premium, highly-curated Unsplash images reflecting pristine, high-end modular designs without visual annotations or logo artifacts
const warvalHeroDusk = "https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&w=1600&q=80"; 
const warvalAboutTall = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80";
const cedarLaneHome = "https://images.unsplash.com/photo-1525113990976-399835c43838?auto=format&fit=crop&w=800&q=80"; 
const pineRidgeHome = "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=800&q=80"; 
const willowCreekHome = "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"; 
const warvalTestimonialBg = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80";

// Model specs to swap dynamically based on selection
const MODEL_DETAILS = {
  cedar: {
    id: "cedar",
    name: "Cedar Lane Tiny Home",
    desc: "A versatile tiny home designed for sustainable living, emphasizing minimalism and energy efficiency.",
    image: cedarLaneHome,
    area: "320 SQ FT",
    modules: "01 Unit",
    code: "REP: CL-TH-01",
    coords: "41.8781° N, 87.6298° W",
    scale: "1:25",
    features: ["Cross-laminated timber core", "R-30 high-performance envelope", "Integrated graywater system", "Smart folding-wall optimization"]
  },
  pine: {
    id: "pine",
    name: "Pine Ridge Cabin",
    desc: "An elevated modular design matching high-elevation meadows and sharp slope layouts beautifully.",
    image: pineRidgeHome,
    area: "640 SQ FT",
    modules: "02 Units",
    code: "REP: PR-MC-02",
    coords: "46.8529° N, 121.7604° W",
    scale: "1:40",
    features: ["Steel screw pile foundation support", "Triple-glazed Alpine wood frame windows", "Solar-integrated peak roof", "Central wet-core distribution block"]
  },
  willow: {
    id: "willow",
    name: "Willow Creek Module",
    desc: "A multi-capsule family modular network featuring architectural double pitch-roof wood layouts.",
    image: willowCreekHome,
    area: "1,152 SQ FT",
    modules: "04 Units",
    code: "REP: WC-FM-01",
    coords: "43.0722° N, 107.2917° W",
    scale: "1:50",
    features: ["Four independent connecting pods", "Acoustic buffer corridor links", "Full passive heat reclamation", "Off-grid deep water storage suite"]
  }
};

// Testimonial data
const TESTIMONIALS = [
  {
    quote: "The spatial design inside our cabin is unbelievable. Delivery was precisely on schedule and the construction quality easily outmatches traditional site-builds.",
    author: "Arthur P.",
    role: "Mountain Retreat Owner",
    location: "Cascade Range, WA"
  },
  {
    quote: "Warval made the entire process feel easy. The design was thoughtful, the timeline was clear, and the quality exceeded our expectations.",
    author: "Emma R.",
    role: "Modular Home Owner",
    location: "Saddle Mountains, WA"
  },
  {
    quote: "Building off-grid in remote conditions is usually a nightmare. Warval fabricated the modules in 8 weeks, trucked them in, and anchored them securely in two days.",
    author: "Marcus G.",
    role: "Eco Cabin Owner",
    location: "Driftwood Meadows, OR"
  }
];

export default function Home() {
  const [activeHeroIdx, setActiveHeroIdx] = useState<number>(0);
  const [activeModel, setActiveModel] = useState<keyof typeof MODEL_DETAILS>("willow");
  const [activeServiceIdx, setActiveServiceIdx] = useState<number>(0);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Customizer Assistant Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customSpec, setCustomSpec] = useState<any>(null);
  const [quoteLockedCode, setQuoteLockedCode] = useState<string | null>(null);
  
  // Form input states
  const [buyerStyle, setBuyerStyle] = useState("Cedar Lane");
  const [buyerSize, setBuyerSize] = useState("Standard (640 sq ft)");
  const [buyerLocation, setBuyerLocation] = useState("Reno, NV");
  const [buyerEco, setBuyerEco] = useState("Solar Ready");
  const [buyerBudget, setBuyerBudget] = useState("$150,000");

  // Newsletter subscription matching footer
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success">("idle");

  // Mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hero Carousel Backgrounds
  const HERO_SLIDES = [
    {
      title: "Sustainable Architecture",
      location: "Intelligent Design Systems",
      image: warvalHeroDusk,
      area: "320–1,600 SQ FT",
      desc: "Intelligent modular architecture designed for modern sustainability and efficient, high-end living."
    },
    {
      title: "Northline Family Module",
      location: "Northline Forest, MT",
      image: willowCreekHome,
      area: "1,152 SQ FT",
      desc: "Spacious four-pod modular homestead connecting private sleeping capsules with massive central decks."
    },
    {
      title: "Driftwood Private Capsule",
      location: "Driftwood Bluff, OR",
      image: pineRidgeHome,
      area: "640 SQ FT",
      desc: "Scenic coastal double-box config featuring elevated panoramic living windows and light-gauge spruce framework."
    }
  ];

  // Services accordion list
  const SERVICES = [
    {
      title: "01 / Innovation & Expandable Modules",
      brief: "Seamless integration with existing Warval units.",
      detail: "Our modular lock-joining system allows you to insert new bedrooms, office modules, or covered deck corridors directly onto your current structure as your lifestyle expands, with no major foundation revisions necessary."
    },
    {
      title: "02 / Off-Grid & Eco Solutions",
      brief: "Solar-ready and water storage for remote living.",
      detail: "Specially packaged with lithium batteries, thermal active smart cladding, dry composting wastewater solutions, and heavy snow load loadouts to enable peaceful, zero-carbon off-grid isolation."
    },
    {
      title: "03 / Custom Modular Engineering",
      brief: "Tailored systems adapted to your specific site.",
      detail: "Collaborate with our team to customize window placements, skylights, oak cladding grades, and custom storage built-ins to fit the micro-climates, wind loads, and topography of your private parcel."
    },
    {
      title: "04 / Tiny Home Design & Build",
      brief: "Efficient layouts and high-performance insulation.",
      detail: "Precision factory fabrication ensuring sub-millimeter tolerances. Framed with premium Baltic wood lumber in our controlled facilities, arriving fully wired, insulated, and plumbed."
    }
  ];

  // Handle subscriber submit
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setSubStatus("loading");
    setTimeout(() => {
      setSubStatus("success");
      setSubEmail("");
    }, 1200);
  };

  // Submit customization query to real server-side Gemini endpoint
  const designCustomHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCustomSpec(null);
    
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: buyerStyle,
          size: buyerSize,
          location: buyerLocation,
          ecoLevel: buyerEco,
          budget: buyerBudget
        })
      });

      const data = await response.json();
      if (response.ok) {
        setCustomSpec(data);
      } else {
        throw new Error(data.error || "Failed to generate design specification.");
      }
    } catch (err) {
      console.error(err);
      // Hard fallback if something gets interrupted
      setCustomSpec({
        modelName: `The Warval Custom ${buyerStyle} Pod`,
        areaSqFt: buyerSize.includes("Micro") ? 320 : buyerSize.includes("Standard") ? 640 : 1180,
        modulesCount: buyerSize.includes("Micro") ? 1 : buyerSize.includes("Standard") ? 2 : 4,
        foundationRecommendation: "Reinforced helical steel screw piles suited for local topography.",
        woodMaterials: "Structural CLT pine with carbon-treated custom spruce siding.",
        insulationRating: "High-density wood fiber panels offering pristine thermal barrier protection.",
        floorPlanLayout: "Modular layout optimization pairing spatial private sleeping pods with an open-flow social living core.",
        customFeatures: ["Smart solar-connected power deck paneling", "Insulated floor-to-ceiling glass paneling", "Fully integrated technical wet wall"],
        solarCapacityKwp: 4.2,
        costBreakdown: { engineering: 9500, fabrication: 82000, sitePrep: 16000, transport: 18000, total: 125500 },
        architectNote: "Your plan is optimized for local performance. Let's arrange a live virtual drafting session!"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-[#faf9f7] text-[#1a1c1b]">
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-[#C9A67A] z-50 origin-left"
        style={{ scaleX }}
      />
      
      {/* HEADER NAVBAR */}
      <header id="header" className="sticky top-0 z-40 bg-[#faf9f7]/95 backdrop-blur-md border-b border-[#dadad8]/40 transition-shadow">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <span className="font-display text-2xl font-bold tracking-[0.18em] text-[#1a1c1b]">WARVAL</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10 text-[13px] font-medium uppercase tracking-widest text-[#1a1c1b]/80">
            <button onClick={() => scrollToSection('hero')} className="hover:text-brand-wood transition-colors relative py-1">
              Home
              {activeHeroIdx === 0 && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-wood" />}
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-brand-wood transition-colors py-1">About Us</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-brand-wood transition-colors py-1">Projects</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-brand-wood transition-colors py-1">Services</button>
            <button onClick={() => scrollToSection('anatomy')} className="hover:text-brand-wood transition-colors py-1">Floorplans</button>
          </nav>

          {/* Custom CTA */}
          <div className="hidden md:block">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1a1c1b] text-white hover:bg-brand-forest transition-colors text-[11px] font-semibold uppercase tracking-widest px-6 py-3 rounded-full cursor-pointer"
            >
              Request a Quote
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1a1c1b] hover:text-brand-wood transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#faf9f7] border-b border-[#dadad8] px-6 py-6 flex flex-col space-y-4 text-[13px] font-semibold uppercase tracking-widest"
            >
              <button onClick={() => scrollToSection('hero')} className="text-left py-2 hover:text-brand-wood">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-left py-2 hover:text-brand-wood">About Us</button>
              <button onClick={() => scrollToSection('projects')} className="text-left py-2 hover:text-brand-wood">Projects</button>
              <button onClick={() => scrollToSection('services')} className="text-left py-2 hover:text-brand-wood">Services</button>
              <button onClick={() => scrollToSection('anatomy')} className="text-left py-2 hover:text-brand-wood">Floorplans</button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="w-full bg-[#1a1c1b] text-white text-center py-3 rounded-full hover:bg-brand-wood transition-colors"
              >
                Request a Quote
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between text-white overflow-hidden bg-brand-dark">
        
        {/* Background slide */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroIdx}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image 
                src={HERO_SLIDES[activeHeroIdx].image}
                alt={HERO_SLIDES[activeHeroIdx].title}
                fill
                priority
                className="object-cover brightness-75"
                referrerPolicy="no-referrer"
              />
              {/* Radial gradient overlay for architectural magazine aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b241d]/90 via-[#1b241d]/40 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Top Spacer */}
        <div />

        {/* Core Tagline Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-12 md:pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-white">
              A better Way <br className="hidden md:inline" />to Build <br className="md:hidden" />
              — Simplified.
            </h1>
            
            {/* Custom structural wood accent divider line */}
            <div className="w-24 h-0.5 bg-brand-wood my-6" />

            <p className="text-white/80 font-light text-base md:text-lg tracking-wide leading-relaxed max-w-lg">
              {HERO_SLIDES[activeHeroIdx].desc}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  const matchKey = activeHeroIdx === 0 ? "willow" : activeHeroIdx === 1 ? "willow" : "pine";
                  setActiveModel(matchKey as any);
                  scrollToSection('projects');
                }}
                className="bg-white text-[#1a1c1b] hover:bg-brand-wood hover:text-[#1a1c1b] transition-all duration-300 text-[11px] font-semibold uppercase tracking-widest px-6 py-4 rounded-full flex items-center space-x-2.5 group"
              >
                <CompassIcon size={14} className="group-hover:rotate-45 transition-transform" />
                <span>Explore Our Homes</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Carousel slide indicators and specs (Dynamic Bottom Rail) */}
        <div className="relative z-10 bg-gradient-to-t from-[#1a1c1b] to-transparent pt-12 pb-10">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHeroIdx(idx)}
                className={`text-left p-6 border-t-[3px] transition-all cursor-pointer ${
                  activeHeroIdx === idx 
                    ? "border-brand-wood bg-white/10 backdrop-blur-sm" 
                    : "border-white/20 bg-black/20 hover:border-white/50"
                }`}
              >
                <span className="font-mono text-xs text-brand-wood tracking-widest font-semibold block mb-1">0{idx + 1}</span>
                <h4 className="font-display text-sm font-semibold tracking-wider text-white mb-1 uppercase">{slide.title}</h4>
                <p className="text-white/60 text-xs font-light tracking-wide">{slide.location}</p>
                
                {/* Micro tech row */}
                <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/40 uppercase">
                  <span>Footprint: {slide.area}</span>
                  {activeHeroIdx === idx && (
                    <motion.span layoutId="activeDot" className="h-1.5 w-1.5 bg-brand-wood rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT WARVAL SECTION */}
      <section id="about" className="py-24 md:py-32 bg-[#faf9f7] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: text blocks */}
            <div className="lg:col-span-6 space-y-8">
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-brand-forest uppercase">Who We Are</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] text-[#1a1c1b]">
                We create modular and tiny homes designed for modern living.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#1a1c1b]/80 font-light text-[15px] leading-relaxed">
                <p>
                  Our approach redefines standard residential construction. By manufacturing in a controlled environment, we ensure millimeter precision, minimize waste, and accelerate your timeline without cutting a single corner.
                </p>
                <p>
                  By combining smart design, factory-built precision, and a transparent process, we help homeowners move faster from idea to reality. Every Warval home is created with meticulous attention to detail and rigorous quality controls.
                </p>
              </div>

              {/* Technical stat counter row */}
              <div className="pt-6 border-t border-[#dadad8] grid grid-cols-3 gap-6 font-mono text-center md:text-left">
                <div>
                  <h4 className="text-3xl font-bold text-[#1a1c1b]">8–12<span className="text-brand-wood text-xl">wks</span></h4>
                  <p className="text-[10px] text-[#1a1c1b]/60 uppercase tracking-widest mt-1">Factory Build Window</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-[#1a1c1b]">Up to</h4>
                  <p className="text-[10px] text-[#1a1c1b]/60 uppercase tracking-widest mt-1">Off-Grid Configurable</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-[#1a1c1b]">R-30+</h4>
                  <p className="text-[10px] text-[#1a1c1b]/60 uppercase tracking-widest mt-1">Envelope Insulation</p>
                </div>
              </div>
              <p className="text-[9px] text-[#1a1c1b]/40 italic leading-relaxed pt-3 block md:text-left text-center">
                * Typical factory prefabrication range; off-grid readiness and thermal performance vary by configuration and site conditions.
              </p>
            </div>

            {/* Right side: Tall scenic image with overlay */}
            <div className="lg:col-span-6 relative flex justify-center">
              
              {/* Outer frame matching architectural mockup */}
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-lg overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
                  alt="Modern timber modular house exterior layout"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating "Homes Built" Capsule Card */}
                <div className="absolute bottom-8 left-8 bg-white p-6 shadow-xl rounded border border-[#dadad8]/40 max-w-[170px]">
                  <h3 className="font-display text-4xl font-extrabold text-[#1a1c1b] tracking-tighter">100+</h3>
                  <p className="font-mono text-[10px] text-brand-forest uppercase tracking-widest font-bold mt-1">Homes Built</p>
                  <div className="w-10 h-[1.5px] bg-[#1a1c1b] mt-3" />
                </div>
              </div>

              {/* Backing structural wireframe graphic accent */}
              <div className="absolute -top-8 -right-8 w-64 h-64 border-t border-r border-[#dadad8] -z-10 bg-[#f4f3f1]" />
            </div>

          </div>
        </motion.div>
      </section>

      {/* BUILT FOR ENVIRONMENT (Atmospheric dark landscape bridge from static site) */}
      <section className="relative py-28 md:py-36 text-white overflow-hidden bg-brand-dark">
        {/* Background image & deep layout shader */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&w=1600&q=80"
            alt="Built for Environment"
            fill
            className="object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#111111]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[400px]">
          <div className="space-y-4">
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#C9A67A] uppercase">Built For Environment</span>
            <h2 className="font-display text-4xl md:text-5.5xl font-bold tracking-tight text-white leading-none uppercase">
              Engineered for<br />any climate.
            </h2>
          </div>
          <div className="space-y-6">
            <p className="text-white/80 font-light text-base md:text-lg leading-relaxed">
              Every structure is engineered to withstand varying climates while maintaining an ultra-low carbon footprint. Intelligent spatial configuration means maximum utility in minimal square footage.
            </p>
            <button 
              onClick={() => {
                setActiveModel("cedar");
                scrollToSection('anatomy');
              }}
              className="inline-flex bg-white hover:bg-[#C9A67A] hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest px-8 py-4.5 rounded-full text-[#1a1c1b] cursor-pointer"
            >
              View Spec Sheet
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY SELECT DISPLAY (Overlapping Image Stack from user website) */}
      <section className="py-24 bg-[#faf9f7] overflow-hidden border-b border-[#dadad8]/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-brand-forest uppercase">Recent Work</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1c1b] uppercase">
              A Selection of Newly Built<br />Modular and Tiny Homes
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left side text detail */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs font-bold tracking-widest text-[#C9A67A] uppercase">Featured Pavilion</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-[#1a1c1b] uppercase tracking-tight">The Solitaire Home</h3>
              <p className="text-[#1a1c1b]/80 font-light text-[15px] leading-relaxed">
                A single-module pavilion featuring expansive floor-to-ceiling glass, raw cedar cladding, and high-performance off-grid capability. Built with exact millimetric precision in controlled laboratory environments.
              </p>
              <div className="pt-4">
                <button 
                  onClick={() => {
                    setActiveModel("cedar");
                    scrollToSection("anatomy");
                  }}
                  className="font-mono text-xs font-bold uppercase tracking-widest text-[#1a1c1b] border-b-2 border-[#1a1c1b] pb-1 hover:text-brand-wood hover:border-brand-wood transition-colors inline-flex items-center space-x-2 cursor-pointer"
                >
                  <span>Explore Layout</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Right side: Dual Overlapping Stack images */}
            <div className="lg:col-span-1" />
            <div className="lg:col-span-6 relative h-[400px] md:h-[480px] w-full">
              {/* Backing structural frame */}
              <div className="absolute top-0 left-0 w-[75%] h-[80%] rounded-sm overflow-hidden shadow-lg border border-[#dadad8]/40">
                <Image 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
                  alt="Modular Architecture Background frame"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Fronting primary image */}
              <div className="absolute bottom-0 right-0 w-[65%] h-[75%] rounded-sm overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-[#faf9f7] z-10">
                <Image 
                  src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80"
                  alt="Tiny home exterior detail view"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGNED TO ADAPT / MODELS GRID SECTION */}
      <section id="projects" className="py-24 bg-[#efeeec] border-t border-b border-[#dadad8]/50">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-4">
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-brand-forest uppercase">What we create</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1c1b]">
                Explore Our<br className="hidden md:inline" /> Signature Models
              </h2>
            </div>
            
            <button 
              onClick={() => {
                setActiveModel(activeModel === "cedar" ? "pine" : activeModel === "pine" ? "willow" : "cedar");
                scrollToSection('anatomy');
              }}
              className="bg-[#1a1c1b] text-white hover:bg-brand-wood hover:text-[#1a1c1b] transition-all text-[11px] font-semibold uppercase tracking-widest px-6 py-4 rounded-full flex items-center space-x-2.5 self-start md:self-end"
            >
              <Grid3X3 size={14} />
              <span>Explore All Models</span>
            </button>
          </div>

          {/* Interactive Bento grid layout matching the mockup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cedar Lane Large Feature Card */}
            <div 
              onClick={() => {
                setActiveModel("cedar");
                scrollToSection('anatomy');
              }}
              className={`lg:col-span-8 group relative rounded-lg overflow-hidden shadow-lg cursor-pointer h-[500px] transition-all border-2 ${
                activeModel === "cedar" ? "border-brand-wood scale-[0.99]" : "border-transparent"
              }`}
            >
              <Image 
                src={cedarLaneHome}
                alt="Cedar Lane Tiny Home"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Dark subtle shade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Details Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end text-white">
                <span className="font-mono text-[10px] text-brand-wood uppercase tracking-widest font-bold mb-2">320 Sq Ft  •  Single Pod</span>
                <h3 className="font-display text-2xl md:text-3.5xl font-bold tracking-tight mb-2">Cedar Lane Tiny Home</h3>
                <p className="text-white/80 font-light text-xs md:text-sm max-w-lg leading-relaxed">
                  A versatile tiny home designed for sustainable living, emphasizing minimalism, high-performance wood fiber envelopes, and extreme thermal resilience.
                </p>
                <div className="mt-4 flex items-center space-x-2 group-hover:text-brand-wood text-white/50 text-[11px] font-mono uppercase tracking-widest">
                  <span>View Technical Blueprints</span>
                  <ArrowRight size={12} className="transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>

            {/* Right stacked models */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              
              {/* Pine Ridge model */}
              <div 
                onClick={() => {
                  setActiveModel("pine");
                  scrollToSection('anatomy');
                }}
                className={`group relative rounded-lg overflow-hidden shadow-lg cursor-pointer flex-1 h-[236px] transition-all border-2 ${
                  activeModel === "pine" ? "border-brand-wood scale-[0.99]" : "border-transparent"
                }`}
              >
                <Image 
                  src={pineRidgeHome}
                  alt="Pine Ridge modular plan"
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="font-mono text-[9px] text-brand-wood uppercase tracking-widest block font-semibold mb-1">640 Sq Ft  •  Double Unit</span>
                  <h4 className="font-display text-lg font-bold tracking-wider mb-1 uppercase">Pine Ridge</h4>
                </div>
              </div>

              {/* Willow Creek model */}
              <div 
                onClick={() => {
                  setActiveModel("willow");
                  scrollToSection('anatomy');
                }}
                className={`group relative rounded-lg overflow-hidden shadow-lg cursor-pointer flex-1 h-[236px] transition-all border-2 ${
                  activeModel === "willow" ? "border-brand-wood scale-[0.99]" : "border-transparent"
                }`}
              >
                <Image 
                  src={willowCreekHome}
                  alt="Willow Creek combined design"
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="font-mono text-[9px] text-brand-wood uppercase tracking-widest block font-semibold mb-1">1,152 Sq Ft  •  Quad Module</span>
                  <h4 className="font-display text-lg font-bold tracking-wider mb-1 uppercase">Willow Creek</h4>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SPECIALIZED MODULAR EXPERTISE / SERVICES */}
      <section id="services" className="py-24 md:py-32 bg-[#faf9f7] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Premium image from user website */}
            <div className="lg:col-span-5 relative h-[450px] lg:h-[550px] w-full rounded-lg overflow-hidden border border-[#dadad8]/60 shadow-xl">
              <Image 
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Consultation meeting & modular blueprint planning"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 text-white text-left max-w-sm hidden md:block">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#C9A67A] font-bold">Services & Craft</span>
                <h4 className="font-display text-md font-bold mb-1 uppercase tracking-wider">Millimetric Manufacturing</h4>
                <p className="text-white/70 text-[11px] font-light leading-relaxed">Every structure is precision engineered to meet top durability grades and certified for eco-smart ratings.</p>
              </div>
            </div>

            {/* Right accordion rows */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#546255] uppercase">Our Services</span>
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1c1b] uppercase">
                  Capabilities
                </h2>
              </div>

              <div className="space-y-4">
                {SERVICES.map((srv, idx) => (
                  <div 
                    key={idx}
                    className="border-b border-[#dadad8] pb-6 cursor-pointer"
                    onClick={() => setActiveServiceIdx(idx)}
                  >
                    <div className="flex items-center justify-between py-4 select-none">
                      <div className="space-y-1">
                        <h3 className="font-display text-lg md:text-xl font-bold tracking-tight text-[#1a1c1b] uppercase">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-brand-forest/80 font-mono tracking-wide">
                          {srv.brief}
                        </p>
                      </div>
                      {/* Expand arrow indicator with state rotation */}
                      <motion.div
                        animate={{ rotate: activeServiceIdx === idx ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#1a1c1b]/80 p-2 hover:bg-[#efeeec] rounded-full transition-colors shrink-0"
                      >
                        <ArrowRight size={18} />
                      </motion.div>
                    </div>

                    <AnimatePresence initial={false}>
                      {activeServiceIdx === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm font-light leading-relaxed text-[#1a1c1b]/80 max-w-2xl py-2 bg-[#f4f3f1] p-4 rounded border-l-4 border-[#546255]">
                            {srv.detail}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* SCALABLE HOMES / SCENIC WIDE INTERIOR BORDER SPLIT */}
      <section className="bg-brand-dark py-24 text-center text-white border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight uppercase leading-tight">
            Scalable Homes<br />Created For Living.
          </h2>
          <div className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[450px] rounded overflow-hidden shadow-2xl border border-white/10 mt-8">
            <Image 
              src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80"
              alt="Wide angle interior architectural view"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
                />
          </div>
        </div>
      </section>

      {/* CORE LAYOUT / ANATOMY STUDY */}
      <section id="anatomy" className="py-24 bg-[#efeeec] border-t border-b border-[#dadad8]/40">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header row split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-12">
            <div className="md:col-span-7 space-y-4">
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-brand-forest uppercase">Structural Anatomy</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[#1a1c1b]">
                The Core Layout
              </h2>
            </div>
            <div className="md:col-span-5 text-[#1a1c1b]/70 font-light text-xs md:text-sm leading-relaxed border-l-2 border-brand-wood pl-6">
              A schematic overview of the modular pods that comprise our custom architectural blueprints, illustrating fluid transit layers and strict mechanical wet-core positions. Select home scopes beneath to adjust structural readings.
            </div>
          </div>

          {/* Model toggle switcher */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button 
              onClick={() => setActiveModel("cedar")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${
                activeModel === "cedar" ? "bg-[#1a1c1b] text-white border-[#1a1c1b]" : "bg-white text-[#1a1c1b] border-[#dadad8] hover:bg-[#f4f3f1]"
              }`}
            >
              Cedar Lane 320 Sq Ft
            </button>
            <button 
              onClick={() => setActiveModel("pine")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${
                activeModel === "pine" ? "bg-[#1a1c1b] text-white border-[#1a1c1b]" : "bg-white text-[#1a1c1b] border-[#dadad8] hover:bg-[#f4f3f1]"
              }`}
            >
              Pine Ridge 640 Sq Ft
            </button>
            <button 
              onClick={() => setActiveModel("willow")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest border transition-all ${
                activeModel === "willow" ? "bg-[#1a1c1b] text-white border-[#1a1c1b]" : "bg-white text-[#1a1c1b] border-[#dadad8] hover:bg-[#f4f3f1]"
              }`}
            >
              Willow Creek 1,152 Sq Ft
            </button>
          </div>

          {/* Blueprint container card layout */}
          <div className="bg-white rounded-lg p-6 md:p-10 shadow-xl border border-[#dadad8]/45 relative overflow-hidden">
            
            {/* Tech grid layout header */}
            <div className="flex items-center justify-between border-b border-[#dadad8]/60 pb-5 mb-8 text-mono text-[10px] text-[#1a1c1b]/60">
              <span className="font-bold tracking-[0.15em] uppercase text-brand-primary">{MODEL_DETAILS[activeModel].code}</span>
              <span className="font-bold tracking-[0.15em] uppercase text-brand-primary">SCALE: {MODEL_DETAILS[activeModel].scale}</span>
            </div>

            {/* Core Schematic Blueprint Frame with the literal URL block style from the physical graphic */}
            <div className="border border-[#dadad8]/60 rounded-sm bg-[#faf9f7] p-8 md:p-16 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#e3e2e0_1px,transparent_1px),linear-gradient(to_bottom,#e3e2e0_1px,transparent_1px)] bg-[size:28px_28px] opacity-20 pointer-events-none" />
              
              {/* Optional user rendering toggle so they can inspect the real layout or enjoy the exact raw mock blueprint card */}
              <div className="absolute top-4 right-4 z-10">
                <span className="inline-flex rounded-full shadow-sm bg-white border border-[#dadad8] p-0.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 text-brand-forest">
                    Technical schematic mode
                  </span>
                </span>
              </div>

              {/* Center layout content wrapper displaying the technical schematic model blueprint image */}
              <div className="w-full max-w-3xl text-center z-10 px-4 md:px-12 py-8 bg-white rounded-sm border border-[#dadad8]/60 relative aspect-[1.4] md:aspect-[1.6] h-[300px] md:h-[450px]">
                <Image 
                  src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1000&q=80"
                  alt={`Technical blueprint schematic for ${MODEL_DETAILS[activeModel].name}`}
                  fill
                  className="object-contain p-4 md:p-8"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bottom Tech Grid Spec sheet bar matching the layout of the mockup image */}
            <div className="mt-8 pt-8 border-t border-[#dadad8]/60 flex flex-col md:flex-row md:items-end justify-between gap-6">
              
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap items-center gap-12 font-mono">
                  {/* Total Area Block */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#1a1c1b]/50 uppercase tracking-widest block font-medium">Total Area</span>
                    <p className="text-[16px] font-bold text-[#1a1c1b] tracking-tight">{MODEL_DETAILS[activeModel].area}</p>
                  </div>

                  {/* Modules Block */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#1a1c1b]/50 uppercase tracking-widest block font-medium">Modules</span>
                    <p className="text-[16px] font-bold text-[#1a1c1b] tracking-tight">{MODEL_DETAILS[activeModel].modules}</p>
                  </div>
                </div>

                {/* Sub row - coordinates beneath */}
                <div className="font-mono text-[10px] text-[#1a1c1b]/50 tracking-wider">
                  <span>COORD: {MODEL_DETAILS[activeModel].coords}</span>
                </div>
              </div>

              {/* Precision skeletal tower SVG mast on the right side of the footer */}
              <div className="flex items-center space-x-6">
                <div className="hidden sm:flex flex-col text-right font-mono text-[10px] space-y-1">
                  <span className="text-brand-forest font-bold uppercase tracking-widest inline-flex items-center justify-end">
                    <ShieldCheck size={12} className="mr-1 inline text-brand-forest" /> Stitched Spec Approved
                  </span>
                  <span className="text-[#1a1c1b]/40">Active Draft Ref: #{MODEL_DETAILS[activeModel].code.replace("REP: ", "")}</span>
                </div>
                
                {/* Skeletal tower crane mast design element matching the mockup graphic */}
                <div className="text-[#1a1c1b]/30 p-1 border border-[#dadad8]/50 rounded-sm bg-[#faf9f7] hover:text-brand-wood transition-colors">
                  <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 2 L6 22 M12 2 L18 22 M6 22 L18 22" />
                    <path d="M9 12 L15 12" />
                    <path d="M7.5 17 L16.5 17" strokeDasharray="1 1" />
                    <path d="M12 2 L12 22" />
                    <path d="M9 12 L12 17 M15 12 L12 17" />
                    <circle cx="12" cy="2" r="1.5" className="fill-brand-wood stroke-brand-wood" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Features lists block */}
            <div className="mt-8 bg-[#faf9f7] p-6 rounded border border-[#dadad8]/40">
              <h5 className="font-display text-[11px] text-[#1a1c1b] uppercase tracking-wider font-bold mb-4 flex items-center">
                <HardHat size={12} className="text-brand-forest mr-1.5" />
                Active Model Blueprint Integrity:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {MODEL_DETAILS[activeModel].features.map((feat, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-[#1a1c1b]/80 font-mono">
                    <Check size={14} className="text-brand-wood mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative py-28 md:py-36 text-white overflow-hidden bg-brand-dark">
        
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"
            alt="Scenic luxury cabin at dusk"
            fill
            className="object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#1b241d]/75" />
        </div>

        {/* Testimonial container */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          
          <span className="font-mono text-xs tracking-[0.25em] text-brand-wood uppercase font-semibold">Trusted by Homeowners</span>
          
          {/* Star Rating indicators */}
          <div className="flex items-center justify-center space-x-1 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
          </div>

          <div className="min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <blockquote className="font-display text-2xl md:text-4xl font-light italic leading-snug tracking-wide text-white/95 max-w-3xl mx-auto">
                  “{TESTIMONIALS[activeTestimonialIdx].quote}”
                </blockquote>
                
                <div className="space-y-1 font-mono">
                  <cite className="not-italic font-bold text-sm tracking-wider uppercase text-white block">
                    {TESTIMONIALS[activeTestimonialIdx].author}
                  </cite>
                  <span className="text-xs text-white/60 uppercase tracking-widest block font-light">
                    {TESTIMONIALS[activeTestimonialIdx].role} — {TESTIMONIALS[activeTestimonialIdx].location}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicator Dot & Nav bar */}
          <div className="pt-8 border-t border-white/20 flex items-center justify-between max-w-xs mx-auto">
            <button 
              onClick={() => setActiveTestimonialIdx((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))}
              className="p-2 border border-white/30 rounded-full hover:bg-white hover:text-[#1a1c1b] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex space-x-2">
              {TESTIMONIALS.map((_, i) => (
                <span 
                  key={i} 
                  className={`h-2 w-2 rounded-full transition-all ${activeTestimonialIdx === i ? "bg-brand-wood w-4" : "bg-white/30"}`} 
                />
              ))}
            </div>
            <button 
              onClick={() => setActiveTestimonialIdx((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))}
              className="p-2 border border-white/30 rounded-full hover:bg-white hover:text-[#1a1c1b] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* CORE CTA BOX */}
      <section className="py-24 bg-[#faf9f7] text-center border-b border-[#dadad8]">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[#1a1c1b] leading-tight uppercase">
            Start your modular home journey with ease and intelligent design.
          </h2>
          <p className="text-sm md:text-base text-[#1a1c1b]/70 font-light leading-relaxed max-w-xl mx-auto">
            Get in touch with our design engineers to review configurations, local permitting, and instant pricing frameworks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1a1c1b] hover:bg-brand-wood text-white hover:text-[#1a1c1b] transition-all text-[11px] font-bold uppercase tracking-widest px-8 py-5 rounded-full shadow-lg cursor-pointer"
            >
              Start Building Your Home
            </button>
            <button 
              onClick={() => {
                setActiveModel("willow");
                scrollToSection('anatomy');
              }}
              className="bg-[#efeeec] hover:bg-[#dadad8] text-[#1a1c1b] transition-all text-[11px] font-bold uppercase tracking-widest px-8 py-5 rounded-full cursor-pointer"
            >
              View Floor Plans
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1B241D] text-white/90 py-16 border-t border-[#dadad8]/10 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Main Logo & details clm */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="font-display text-2xl font-bold tracking-[0.18em] text-white">WARVAL</span>
            </div>
            
            <p className="text-white/60 font-light text-xs leading-relaxed max-w-sm">
              Build for today. Ready for tomorrow.<br />Architectural precision meets modern organicPrefab modular living.
            </p>

            <div className="space-y-2 text-white/80">
              <div className="flex items-center space-x-3">
                <MapPin size={14} className="text-brand-wood shrink-0" />
                <span>Portland, Oregon, USA</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={14} className="text-brand-wood shrink-0" />
                <span>+1 (503) 241-1104</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={14} className="text-brand-wood shrink-0" />
                <span>hello@warval-cabin.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A67A]">Company</h4>
            <ul className="space-y-2.5 font-light text-white/70">
              <li><button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Warval</button></li>
              <li><button onClick={() => scrollToSection('projects')} className="hover:text-white transition-colors">Projects</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => setIsModalOpen(true)} className="hover:text-white transition-colors">FAQ</button></li>
            </ul>
          </div>

          {/* Social Network Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A67A]">Connect</h4>
            <ul className="space-y-2.5 font-light text-white/70">
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Newsletter signup column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A67A]">Newsletter</h4>
            <p className="text-white/60 font-light text-xs leading-relaxed">
              Stay updated on our latest modular designs and sustainable off-grid packs.
            </p>

            {subStatus === "success" ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-brand-forest/20 text-[#C9A67A] p-3 rounded text-[11px] font-medium border border-brand-forest/40"
              >
                Subscription successful! Welcome to the modern prefab loop.
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex items-center bg-[#1a1c1b] rounded overflow-hidden border border-white/10 focus-within:border-[#C9A67A] transition-colors">
                <input 
                  type="email" 
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="Your email" 
                  required
                  className="bg-transparent border-none text-white px-4 py-3 placeholder:text-white/40 focus:outline-none w-full text-xs"
                />
                <button 
                  type="submit" 
                  disabled={subStatus === "loading"}
                  className="bg-brand-wood text-black p-3 hover:bg-white hover:text-black transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {subStatus === "loading" ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Copywrite row */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 text-center text-white/40 text-[10px] font-light uppercase tracking-wider flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Warval Cabin Systems LLC. All rights reserved.</span>
          <span>Architectural Integrity • Carbon Neutral Prefabrication</span>
        </div>
      </footer>

      {/* INTELLIGENT AI DESIGN ASSISTANT MODAL (SLIDE UP) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative border border-[#dadad8]"
            >
              
              {/* Sticky Close Button */}
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setCustomSpec(null);
                  setQuoteLockedCode(null);
                }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#efeeec] text-[#1a1c1b] transition-colors sticky z-10"
              >
                <X size={20} />
              </button>

              <div className="p-6 md:p-10 space-y-8">
                
                {quoteLockedCode ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 px-6 space-y-6"
                  >
                    <div className="mx-auto w-16 h-16 bg-[#546255]/10 rounded-full flex items-center justify-center text-[#546255] mb-4">
                      <ShieldCheck size={36} className="text-brand-forest" />
                    </div>
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9A67A] font-bold">RESERVATION VAULTED</span>
                      <h4 className="font-display text-2xl md:text-3xl font-extrabold text-[#1a1c1b] uppercase">Quote Locked Successfully!</h4>
                      <p className="text-sm text-[#1a1c1b]/70 font-light max-w-md mx-auto">
                        Your custom blueprint package has been generated and saved. An engineering advisor is scheduled to call you to review zoning regulations and transit scheduling.
                      </p>
                    </div>
                    <div className="p-4 bg-[#efeeec] border border-[#dadad8] inline-block rounded font-mono text-xs text-[#1a1c1b]">
                      <span className="text-[#1a1c1b]/50 block uppercase text-[9px] font-bold tracking-wider mb-1">PROGRAM CODE</span>
                      <span className="text-sm font-bold text-brand-forest">{quoteLockedCode}</span>
                    </div>
                    <div className="pt-6">
                      <button 
                        onClick={() => {
                          setIsModalOpen(false);
                          setCustomSpec(null);
                          setQuoteLockedCode(null);
                        }}
                        className="bg-[#1a1c1b] hover:bg-brand-wood text-white hover:text-black transition-all uppercase text-[10px] tracking-widest font-bold px-8 py-3.5 rounded-full cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {/* Intro Title */}
                    <div className="border-b border-[#dadad8] pb-6 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="text-brand-wood animate-bounce" size={20} />
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9A67A] font-bold">Warval AI Architect</span>
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl font-extrabold text-[#1a1c1b]">
                        Intelligent Modular Customizer
                      </h3>
                      <p className="text-xs text-[#1a1c1b]/70 font-light">
                        Collaborate with our server-side artificial intelligence model to calculate exact specifications, thermal systems, and engineering quotes matching your build site layout.
                      </p>
                    </div>

                {/* Form to submit details */}
                {!customSpec && (
                  <form onSubmit={designCustomHome} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                    
                    {/* Style preference */}
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1a1c1b]/80">Modular Style</label>
                      <select 
                        value={buyerStyle}
                        onChange={(e) => setBuyerStyle(e.target.value)}
                        className="bg-[#faf9f7] border border-[#dadad8] rounded p-3 text-xs focus:ring-1 focus:ring-brand-wood focus:outline-none"
                      >
                        <option value="Cedar Lane Style">Cedar Lane (Slight slope, sleek wood cladding)</option>
                        <option value="Pine Ridge Style">Pine Ridge (Steep high slope, strong framing)</option>
                        <option value="Willow Creek Style">Willow Creek (Double pitch-roof, modular connections)</option>
                        <option value="Brutalist Cabin Style">Brutalist Cabin (Raw wood, concrete integration)</option>
                      </select>
                    </div>

                    {/* Structural size selection */}
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1a1c1b]/80">Cabin Volume / Size</label>
                      <select 
                        value={buyerSize}
                        onChange={(e) => setBuyerSize(e.target.value)}
                        className="bg-[#faf9f7] border border-[#dadad8] rounded p-3 text-xs focus:ring-1 focus:ring-brand-wood focus:outline-none"
                      >
                        <option value="Micro Studio (320 sq ft)">Micro Studio (320 sq ft, 1 pod)</option>
                        <option value="Standard Double (640 sq ft)">Standard Double (640 sq ft, 2 pods)</option>
                        <option value="Family Module (1,152 sq ft)">Family Module (1,152 sq ft, 4 pods)</option>
                        <option value="Homestead Layout (1,600 sq ft)">Large Homestead (1,600 sq ft, 6 pods)</option>
                      </select>
                    </div>

                    {/* Geography/terrain */}
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1a1c1b]/80">Expected Build Location (Geography)</label>
                      <input 
                        type="text"
                        value={buyerLocation}
                        onChange={(e) => setBuyerLocation(e.target.value)}
                        placeholder="e.g. Cascade Range, WA or Reno, NV sandy plots"
                        required
                        className="bg-[#faf9f7] border border-[#dadad8] rounded p-3 text-xs focus:ring-1 focus:ring-brand-wood focus:outline-none placeholder:text-[#1a1c1b]/30"
                      />
                    </div>

                    {/* Eco-sustainability parameters */}
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1a1c1b]/80">Off-Grid Efficiency Packages</label>
                      <select 
                        value={buyerEco}
                        onChange={(e) => setBuyerEco(e.target.value)}
                        className="bg-[#faf9f7] border border-[#dadad8] rounded p-3 text-xs focus:ring-1 focus:ring-brand-wood focus:outline-none"
                      >
                        <option value="Standard Solar Ready (Backup panel grid)">Solar-Ready Active Prep</option>
                        <option value="Completely Off-Grid (Composting toilet, solar roof pack, battery cabinet)">Full Sustainable Off-Grid System</option>
                        <option value="PassivHaus Certified Ultra performance insulation">PassivHaus Spec Envelope</option>
                      </select>
                    </div>

                    {/* Target Financial investment */}
                    <div className="flex flex-col space-y-2">
                      <label className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#1a1c1b]/80">Ideal Delivery & Installation Budget</label>
                      <select 
                        value={buyerBudget}
                        onChange={(e) => setBuyerBudget(e.target.value)}
                        className="bg-[#faf9f7] border border-[#dadad8] rounded p-3 text-xs focus:ring-1 focus:ring-brand-wood focus:outline-none"
                      >
                        <option value="$90,000 - $130,000">$90,000 - $130,000</option>
                        <option value="$130,000 - $180,000">$130,000 - $180,000</option>
                        <option value="$180,000 - $260,000">$180,000 - $260,000</option>
                        <option value="$260,000+">$260,000+ (Elite customized homestead)</option>
                      </select>
                    </div>

                    {/* Loading or Trigger panel */}
                    <div className="md:col-span-2 pt-6">
                      <button 
                        type="submit"
                        disabled={isGenerating}
                        className="w-full bg-[#1a1c1b] hover:bg-brand-wood text-white hover:text-[#1a1c1b] transition-all text-xs tracking-widest uppercase font-semibold py-4 rounded-full flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="animate-spin text-brand-wood" size={16} />
                            <span>Querying Warval AI Architect Systems...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles size={16} />
                            <span>Generate Custom Design Package</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}

                {/* AI generated custom contract blueprints/specs display */}
                {customSpec && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    
                    {/* Output headline */}
                    <div className="bg-brand-dark hover:bg-brand-primary p-6 rounded-lg text-white font-mono space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                        <Layers size={90} className="transform rotate-12" />
                      </div>
                      <span className="text-[9px] text-[#C9A67A] uppercase tracking-widest block font-extrabold mb-1">Approved Warval Blueprint Draft</span>
                      <h4 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white uppercase">{customSpec?.modelName}</h4>
                      <p className="text-white/70 font-light text-[11px] leading-relaxed max-w-xl">
                        This layout was structured automatically. Recommended thermal panels, solar wattage loadouts, structural foundation styles, and transit budgets relate specifically to climate constraints in <span className="text-brand-wood font-medium font-mono">{buyerLocation}</span>.
                      </p>
                    </div>

                    {/* 2Column technical readouts specs table */}
                    <div className="border border-[#dadad8] rounded overflow-hidden">
                      <div className="p-4 bg-[#efeeec] border-b border-[#dadad8] font-mono text-[10px] text-[#1a1c1b]/70 flex items-center justify-between uppercase">
                        <span>TECHNICAL ARCHITECTURAL SCHEMA</span>
                        <span className="text-[#C9A67A] font-bold uppercase tracking-wider">SECURE CERTIFICATE</span>
                      </div>
                      
                      <div className="divide-y divide-[#dadad8]/60 text-xs font-mono">
                        
                        {/* Area */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-white">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Planned Interior Area</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-medium">{customSpec?.areaSqFt} SQ FT</span>
                        </div>

                        {/* Stitched modules */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-[#faf9f7]">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Stitched Pod Units</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-medium">{customSpec?.modulesCount} Modules</span>
                        </div>

                        {/* Climate Foundation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-white">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Foundation Suggestion</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-light text-[11px] leading-relaxed">{customSpec?.foundationRecommendation}</span>
                        </div>

                        {/* Lumber frame */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-[#faf9f7]">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Lumber Framework</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-light text-[11px] leading-relaxed">{customSpec?.woodMaterials}</span>
                        </div>

                        {/* Climatic Envelope Insulation */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-white">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Thermal R-Barrier</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-medium">{customSpec?.insulationRating}</span>
                        </div>

                        {/* Flow map layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-[#faf9f7]">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Interior Circulation Flow</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-light text-[11px] leading-relaxed">{customSpec?.floorPlanLayout}</span>
                        </div>

                        {/* Solar arrays */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-white">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Solar Roof Output</span>
                          <span className="md:col-span-2 text-[#1a1c1b] font-medium">{customSpec?.solarCapacityKwp} Kwp array capacity</span>
                        </div>

                        {/* Custom Spec features items */}
                        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2 bg-[#faf9f7]">
                          <span className="text-[#1a1c1b]/50 uppercase text-[10px] font-bold">Bespoke Inclusions</span>
                          <div className="md:col-span-2 space-y-1.5 text-[#1a1c1b]/90 text-[11px] font-light">
                            {customSpec?.customFeatures?.map((f: string, i: number) => (
                              <div key={i} className="flex items-start space-x-1.5">
                                <span className="text-[#C9A67A] shrink-0 font-bold">•</span>
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Financial Estimator Ledger */}
                    <div className="bg-[#efeeec] rounded p-6 font-mono space-y-4">
                      <h5 className="text-[10px] font-bold text-[#1a1c1b]/70 tracking-widest uppercase pb-2 border-b border-[#dadad8]">FINANCIAL ESTIMATOR LEDGER</h5>
                      <div className="space-y-2.5 text-xs text-[#1a1c1b]/80">
                        <div className="flex justify-between">
                          <span>Architectural, Structural Licensing & Engineering:</span>
                          <span className="font-bold">${customSpec?.costBreakdown?.engineering?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Factory Materials Prefabrication & Assembling:</span>
                          <span className="font-bold">${customSpec?.costBreakdown?.fabrication?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Site Foundation Prep, Anchoring & Utility Connections:</span>
                          <span className="font-bold">${customSpec?.costBreakdown?.sitePrep?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-[#dadad8]/80">
                          <span>Loom/Logistics, Site Crane Lift & Modular Stitching:</span>
                          <span className="font-bold">${customSpec?.costBreakdown?.transport?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-base text-[#1a1c1b] font-extrabold uppercase">
                          <span>Estimated Stitch-ready Total:</span>
                          <span className="text-brand-forest">${customSpec?.costBreakdown?.total?.toLocaleString()}*</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-[#1a1c1b]/50 leading-relaxed italic pt-2">
                        * Estimates exclude custom state zoning taxes and local crane rental adjustments if slope gradients exceed 15%. All values correspond to prefab manufacturing parameters locked at local currency.
                      </p>
                    </div>

                    {/* Architect custom signoff */}
                    <div className="flex items-start bg-brand-forest/5 p-4 rounded border-l-4 border-brand-wood text-[11px] leading-relaxed font-light text-[#1a1c1b]/80 gap-3">
                      <Compass size={18} className="text-brand-wood mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold font-mono block mb-1">Architect Signoff Note:</span>
                        {customSpec?.architectNote}
                      </div>
                    </div>

                    {/* Bottom action row */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[#dadad8]">
                      <button 
                        onClick={() => {
                          setCustomSpec(null);
                        }}
                        className="bg-[#efeeec] hover:bg-[#dadad8] text-[#1a1c1b] uppercase text-[10px] tracking-widest font-bold px-6 py-3.5 rounded-full"
                      >
                        Modify Preferences
                      </button>
                      <button 
                        onClick={() => {
                          const generatedCode = `WARVAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                          // Safe premium UI persistence simulated client-side
                          localStorage.setItem("locked_warval_cabin_code", generatedCode);
                          setQuoteLockedCode(generatedCode);
                        }}
                        className="bg-[#1a1c1b] hover:bg-brand-wood text-white hover:text-black uppercase text-[10px] tracking-widest font-bold px-6 py-3.5 rounded-full cursor-pointer transition-colors"
                      >
                        Accept Blueprint & Lock Quote
                      </button>
                    </div>

                  </motion.div>
                )}

                  </>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
