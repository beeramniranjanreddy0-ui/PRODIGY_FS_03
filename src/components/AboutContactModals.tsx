import React, { useState } from 'react';
import { X, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-2xl w-full p-6 sm:p-8 border border-[rgba(240,240,240,0.15)] shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
            The Atelier / Heritage
          </span>
          <h2 className="font-syne text-3xl font-extrabold uppercase text-[#f0f0f0]">
            The Baker's Corner
          </h2>
        </div>

        <div className="font-sans text-xs sm:text-sm text-[#f0f0f0]/80 space-y-4 leading-relaxed">
          <p>
            Established with an uncompromising passion for authentic pastry excellence, <strong>The Baker's Corner</strong> blends classical French pâtisserie technique with soulful celebratory flavours.
          </p>
          <p>
            Every sponge is baked fresh on the day of delivery using pure farm butter, stone-ground unbleached flours, and sustainably sourced Belgian Callebaut chocolate. We strictly say no to artificial preservatives or premixes.
          </p>
          <p>
            Whether it is an intimate midnight birthday surprise with a piped chocolate message, or a three-tier floral wedding centerpiece, we pour meticulous artistry into every detail.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[rgba(240,240,240,0.1)] text-center font-mono text-xs text-[#f0f0f0]">
          <div className="bg-[#1a1a1c] p-3 border border-[rgba(240,240,240,0.1)]">
            <span className="font-syne text-xl font-bold block text-[#d48b7a]">100%</span>
            <span className="text-[10px] uppercase text-[#f0f0f0]/60">Pure Dairy & Cocoa</span>
          </div>
          <div className="bg-[#1a1a1c] p-3 border border-[rgba(240,240,240,0.1)]">
            <span className="font-syne text-xl font-bold block text-[#d48b7a]">50,000+</span>
            <span className="text-[10px] uppercase text-[#f0f0f0]/60">Celebrations</span>
          </div>
          <div className="bg-[#1a1a1c] p-3 border border-[rgba(240,240,240,0.1)]">
            <span className="font-syne text-xl font-bold block text-[#d48b7a]">3-Hour</span>
            <span className="text-[10px] uppercase text-[#f0f0f0]/60">Fresh Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#111113] text-[#f0f0f0] max-w-xl w-full p-6 sm:p-8 border border-[rgba(240,240,240,0.15)] shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#f0f0f0]/70 hover:text-white hover:bg-[#1a1a1c] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#d48b7a] font-bold">
            Direct Concierge
          </span>
          <h2 className="font-syne text-2xl font-extrabold uppercase text-[#f0f0f0]">
            Contact Our Master Atelier
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-[#f0f0f0]/80">
          <div className="bg-[#1a1a1c] p-3.5 border border-[rgba(240,240,240,0.1)] flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#d48b7a] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#f0f0f0] uppercase">Flagship Pâtisserie</strong>
              <span className="text-[11px] text-[#f0f0f0]/60">Plot 42, Baker Street, Jubilee Hills, Hyderabad</span>
            </div>
          </div>

          <div className="bg-[#1a1a1c] p-3.5 border border-[rgba(240,240,240,0.1)] flex items-start gap-2.5">
            <Phone className="w-4 h-4 text-[#d48b7a] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#f0f0f0] uppercase">Hotline & WhatsApp</strong>
              <span className="text-[11px] text-[#f0f0f0]/60">+91 98490 12345 / 040-2345678</span>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="bg-emerald-950/60 text-emerald-300 p-4 border border-emerald-800 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Thank you! Our head pastry chef will respond shortly.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
              />
              <input
                type="email"
                required
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] focus:outline-none focus:border-[#d48b7a]"
              />
            </div>
            <textarea
              rows={3}
              required
              placeholder="Ask about bulk event orders, wedding consultations, or custom cake inquiries..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-[#1a1a1c] border border-[rgba(240,240,240,0.2)] text-[#f0f0f0] font-sans focus:outline-none focus:border-[#d48b7a]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#f0f0f0] hover:bg-[#d48b7a] text-[#111113] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#111113]" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
