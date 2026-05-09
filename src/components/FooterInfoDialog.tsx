import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Briefcase, Info, Smartphone, Wallet, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FooterInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'payment' | 'careers' | 'about' | 'membership' | 'orderStatus' | 'shipping' | null;
}

export const FooterInfoDialog: React.FC<FooterInfoDialogProps> = ({ isOpen, onClose, type }) => {
  const getContent = () => {
    switch (type) {
      case 'orderStatus':
        return {
          title: 'TRACK / ORDERS',
          subtitle: 'REAL-TIME TRACKING',
          icon: <Zap className="w-12 h-12 text-brand-accent" />,
          description: 'Monitor your legacy acquisition from vault to doorstep.',
          tag: 'LOGISTICS',
          items: [
            { name: 'Live Tracking', desc: 'Sync with global carrier protocols for micro-updates.', icon: <ArrowRight className="w-5 h-5 text-brand-accent" /> },
            { name: 'Order History', desc: 'Access your archival acquisition record in your profile.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
            { name: 'Digitized Receipts', desc: 'Encrypted proof of purchase available in-app.', icon: <ShieldCheck className="w-5 h-5 text-brand-accent" /> },
          ]
        };
      case 'shipping':
        return {
          title: 'GLOBAL / SHIPPING',
          subtitle: 'LEGACY DELIVERY',
          icon: <Globe className="w-12 h-12 text-brand-accent" />,
          description: 'Engineered logistics for rapid global distribution.',
          tag: 'NETWORK',
          items: [
            { name: 'Express Vault', desc: '2-4 business days for major global hubs.', icon: <Zap className="w-5 h-5 text-brand-accent" /> },
            { name: 'African Reach', desc: 'Direct routes to Lesotho, SA, and the SADC region.', icon: <Globe className="w-5 h-5 text-brand-accent" /> },
            { name: 'Secure Packaging', desc: 'Double-walled archival grade protection for every drop.', icon: <ShieldCheck className="w-5 h-5 text-brand-accent" /> },
          ]
        };
      case 'payment':
        return {
          title: 'SECURE / PAYMENTS',
          subtitle: 'VAULT SECURITY',
          icon: <CreditCard className="w-12 h-12 text-brand-accent" />,
          description: 'Global transaction processing for the archival circle.',
          tag: 'ENCRYPTED',
          items: [
            { name: 'Visa & Mastercard', desc: 'Secure global credit/debit processing via stripe protocol.', icon: <ShieldCheck className="w-5 h-5 text-brand-accent" /> },
            { name: 'EcoCash Mobile', desc: 'Instant mobile payments for Lesotho & Zimbabwe regions.', icon: <Smartphone className="w-5 h-5 text-brand-accent" /> },
            { name: 'M-Pesa Network', desc: 'Direct mobile wallet transfers across the African continent.', icon: <Zap className="w-5 h-5 text-brand-accent" /> },
            { name: 'Legacy Credits', desc: 'Inner-circle store credit for verified legacy members.', icon: <Globe className="w-5 h-5 text-brand-accent" /> },
          ]
        };
      case 'careers':
        return {
          title: 'MANIFEST / CAREERS',
          subtitle: 'MODELING & BRAND',
          icon: <Briefcase className="w-12 h-12 text-brand-accent" />,
          description: 'Architect the next generation of global aesthetics.',
          tag: 'TALENT',
          items: [
            { name: 'Elite Modeling', desc: 'Become the face of The Fresh Legacy. Show us your aura.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
            { name: 'Brand Visionaries', desc: 'Developing the blueprints for the next cultural shifts.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
            { name: 'Creative Operations', desc: 'Engineers behind the legacy digital & physical experience.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
          ]
        };
      case 'about':
        return {
          title: 'ARCHIVE / ABOUT',
          subtitle: 'OUR BLUEPRINT',
          icon: <Info className="w-12 h-12 text-brand-accent" />,
          description: 'The story behind the steel, stitch, and soul.',
          tag: 'LEGACY',
          items: [
            { name: 'The Vision', desc: 'Born in Lesotho, engineered for a global audience.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
            { name: 'Pure Craftsmanship', desc: 'Uncompromising quality for those who lead the way.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
            { name: 'Global Impact', desc: 'Sustainable manufacturing for future generational health.', icon: <Info className="w-5 h-5 text-brand-accent" /> },
          ]
        };
      default:
        return null;
    }
  };

  const content = getContent();

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl cursor-zoom-out"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row max-h-[80vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-all z-20 group"
        >
          <X className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
        </button>

        {/* Left Visual Section */}
        <div className="md:w-[35%] bg-black p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-brand-accent text-white border-none uppercase text-[9px] font-black tracking-[0.2em] px-4 py-1.5 mb-6 shadow-[0_0_15px_rgba(255,59,48,0.3)]">
              {content.tag} ACCESS
            </Badge>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white leading-[0.95] mb-4">
              {content.title.split(' / ').map((word, i) => (
                <React.Fragment key={word}>
                  {word} {i === 0 && <br/>}
                </React.Fragment>
              ))}
            </h2>
            <div className="h-[2px] w-10 bg-brand-accent rounded-full mt-4" />
          </div>

          <div className="relative z-10">
             <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 mt-8">
                <div className="mb-3 text-brand-accent">{content.icon}</div>
                <p className="text-white font-bold text-base italic tracking-tight">{content.subtitle}</p>
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.1em] mt-1 block">SECURE PROTOCOL V1.0</p>
             </div>
          </div>

          {/* Background Branding */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] font-black italic text-white/[0.02] select-none pointer-events-none tracking-tighter leading-none whitespace-nowrap">
            LGCY
          </div>
        </div>

        {/* Right Functional Section */}
        <div className="flex-1 p-8 md:p-10 flex flex-col bg-white overflow-hidden">
          <div className="mb-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 mb-1">ARCHIVAL INFORMATION</p>
            <p className="text-zinc-500 font-bold text-xs leading-relaxed max-w-sm">
              {content.description}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {content.items.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                className="group p-5 rounded-2xl bg-zinc-50 border border-zinc-100 hover:bg-black hover:border-black transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-tighter italic group-hover:text-white transition-colors">{item.name}</h4>
                    <p className="text-[10px] text-zinc-400 group-hover:text-zinc-500 font-bold leading-tight mt-0.5 transition-colors">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-zinc-100">
            <Button 
              onClick={onClose}
              className="w-full bg-black text-white hover:bg-zinc-800 rounded-2xl py-6 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg transition-all flex items-center justify-center gap-3 group"
            >
              ACKNOWLEDGE
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
