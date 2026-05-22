"use client"

import React, { useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Video, 
  MessageCircle, 
  HeartHandshake, 
  Star,
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";

export default function ConsultationPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      {/* Hero Section - Full Bleed */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url("https://images.unsplash.com/photo-1542385151-efd9000785a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RoZXIlMjBob2xkaW5nJTIwYmFieXxlbnwxfHx8fDE3NzgyNDM1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080")`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F8] via-[#FFF5F8]/80 to-transparent z-10"></div>
        </div>

        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl">
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: "#FACBD8", color: "#6C4735" }}
            >
              👩‍⚕️ Expert Support for Your Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ color: "#6C4735" }}>
              Empowering your <span style={{ color: "#D5557E" }}>breastfeeding</span> experience.
            </h1>
            <p className="text-lg md:text-xl mb-8 leading-relaxed font-medium" style={{ color: "#8B6352" }}>
              Get personalized guidance, emotional support, and evidence-based advice from our certified lactation consultants. Because every drop counts, and you don't have to do it alone. 🐻
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="#booking"
                className="px-8 py-4 rounded-full font-bold text-white transition-transform hover:-translate-y-1 shadow-lg"
                style={{ backgroundColor: "#D5557E" }}
              >
                Book a Free Session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Full Width Banner */}
      <section className="w-full py-20 px-6 sm:px-12 lg:px-24" style={{ backgroundColor: "#FACBD8" }}>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#6C4735" }}>
            Why Consult with Mamabear?
          </h2>
          <p className="text-lg" style={{ color: "#8B6352" }}>
            We combine clinical expertise with warm, mother-to-mother empathy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center transform transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#FFF5F8" }}>
              <HeartHandshake size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#6C4735" }}>Judgment-Free Zone</h3>
            <p style={{ color: "#8B6352" }}>
              Every mother's journey is unique. We provide a safe space to share your struggles without any pressure or judgment.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center transform transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#FFF5F8" }}>
              <Award size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#6C4735" }}>Certified Experts</h3>
            <p style={{ color: "#8B6352" }}>
              Our team consists of IBCLC-certified consultants who stay updated with the latest breastfeeding medicine research.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-sm text-center transform transition-transform hover:-translate-y-2">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: "#FFF5F8" }}>
              <Video size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ color: "#6C4735" }}>Flexible Access</h3>
            <p style={{ color: "#8B6352" }}>
              Choose between private 1-on-1 video calls or text-based consultation based on your availability and comfort.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Experts Section */}
      <section className="w-full py-24 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl md:text-4xl font-black mb-6" style={{ color: "#6C4735" }}>
              Meet Your <br className="hidden lg:block" /> Support Village
            </h2>
            <p className="text-lg mb-8" style={{ color: "#8B6352" }}>
              Our compassionate consultants have helped thousands of mothers overcome latching issues, low supply, and pumping challenges.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} style={{ color: "#D5557E" }} />
                <span className="font-semibold" style={{ color: "#6C4735" }}>IBCLC Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} style={{ color: "#D5557E" }} />
                <span className="font-semibold" style={{ color: "#6C4735" }}>5+ Years Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} style={{ color: "#D5557E" }} />
                <span className="font-semibold" style={{ color: "#6C4735" }}>Moms Themselves</span>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Expert 1 */}
            <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#FACBD8] transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1576669802218-d535933f897c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZlbWFsZSUyMGRvY3RvcnxlbnwxfHx8fDE3NzgyNDM1MTl8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Dr. Sarah" 
                className="w-full h-72 object-cover object-top"
              />
              <div className="p-6" style={{ backgroundColor: "#FFF5F8" }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black" style={{ color: "#6C4735" }}>Dr. Ayu Larasati</h3>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <p className="text-sm font-bold mb-3" style={{ color: "#D5557E" }}>IBCLC, Pediatrician</p>
                <p className="text-sm" style={{ color: "#8B6352" }}>
                  "I believe every mother deserves the right support system to achieve their breastfeeding goals without guilt."
                </p>
              </div>
            </div>

            {/* Expert 2 */}
            <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#FACBD8] transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1673865641073-4479f93a7776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBzbWlsZXxlbnwxfHx8fDE3NzgyNDM1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="Bidan Nisa" 
                className="w-full h-72 object-cover object-top"
              />
              <div className="p-6" style={{ backgroundColor: "#FFF5F8" }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-black" style={{ color: "#6C4735" }}>Bidan Nisa</h3>
                  <div className="flex text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>
                <p className="text-sm font-bold mb-3" style={{ color: "#D5557E" }}>Lactation Counselor</p>
                <p className="text-sm" style={{ color: "#8B6352" }}>
                  "Helping mothers navigate the early postpartum days is my calling. Let's make this journey beautiful together."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking / Pricing Section */}
      <section id="booking" className="w-full py-24 px-6 sm:px-12 lg:px-24 text-center" style={{ backgroundColor: "#FFF5F8" }}>
        <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ color: "#6C4735" }}>
          Ready to Talk?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-16" style={{ color: "#8B6352" }}>
          Choose the consultation method that fits your schedule. Remember, as a Mamabear member, you get special access to our experts!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Option 1: Chat */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm text-left border-4" style={{ borderColor: "#FACBD8" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: "#FFF5F8" }}>
              <MessageCircle size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: "#6C4735" }}>Text Consult</h3>
            <p className="mb-6 font-bold text-xl" style={{ color: "#D5557E" }}>Free ✨</p>
            <p className="mb-8 h-12" style={{ color: "#8B6352" }}>
              Perfect for quick questions, product recommendations, and minor concerns.
            </p>
            <ul className="space-y-3 mb-10">
              <li className="flex items-center gap-3 text-sm" style={{ color: "#6C4735" }}>
                <CheckCircle2 size={18} style={{ color: "#D5557E" }} /> Response within 2 hours
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: "#6C4735" }}>
                <CheckCircle2 size={18} style={{ color: "#D5557E" }} /> Available Mon-Sat
              </li>
            </ul>
            <a 
              href="https://wa.me/628888695757"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-4 rounded-full font-bold text-center transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#FACBD8", color: "#6C4735" }}
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Option 2: Video */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl text-left border-4 relative overflow-hidden" style={{ borderColor: "#D5557E" }}>
            <div 
              className="absolute top-6 right-[-30px] px-10 py-1 rotate-45 font-black text-white text-xs" 
              style={{ backgroundColor: "#D5557E" }}
            >
              RECOMMENDED
            </div>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: "#FFF5F8" }}>
              <Video size={32} style={{ color: "#D5557E" }} />
            </div>
            <h3 className="text-2xl font-black mb-2" style={{ color: "#6C4735" }}>Video Session</h3>
            <p className="mb-6 font-bold text-xl" style={{ color: "#D5557E" }}>Rp 150.000 <span className="text-sm font-normal text-gray-400 line-through ml-2">Rp 300.000</span></p>
            <p className="mb-8 h-12" style={{ color: "#8B6352" }}>
              Deep dive into latching issues, supply management, and emotional support.
            </p>
            <ul className="space-y-3 mb-10">
              <li className="flex items-center gap-3 text-sm" style={{ color: "#6C4735" }}>
                <Clock size={18} style={{ color: "#D5557E" }} /> 45 minutes session
              </li>
              <li className="flex items-center gap-3 text-sm" style={{ color: "#6C4735" }}>
                <CheckCircle2 size={18} style={{ color: "#D5557E" }} /> Personalized action plan
              </li>
            </ul>
            <Link 
              href="/auth"
              className="block w-full py-4 rounded-full font-bold text-white text-center transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#D5557E" }}
            >
              Schedule Video Call
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="w-full py-16 px-6 sm:px-12 lg:px-24" style={{ backgroundColor: "#D5557E" }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
              Not sure where to start?
            </h2>
            <p className="text-pink-100">
              Take our 2-minute assessment to see what support you need.
            </p>
          </div>
          <button className="px-8 py-4 bg-white rounded-full font-bold whitespace-nowrap transition-transform hover:scale-105" style={{ color: "#D5557E" }}>
            Take Assessment
          </button>
        </div>
      </section>
    </div>
  );
}
