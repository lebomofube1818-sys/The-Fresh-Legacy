import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Shield, Zap } from 'lucide-react';

interface VaultButtonProps {
  onClick: () => void;
}

export const VaultButton: React.FC<VaultButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleInteraction = async () => {
    setIsUnlocking(true);
    // Sequence: rotate -> beam -> callback
    await new Promise(resolve => setTimeout(resolve, 800));
    onClick();
    setTimeout(() => setIsUnlocking(false), 1000);
  };

  return (
    <div className="relative group perspective-1000">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleInteraction}
        className="relative cursor-pointer"
        whileHover={{ scale: 1.05, rotateX: 10 }}
        whileTap={{ scale: 0.95, rotateX: -10 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        {/* Glow Effects */}
        <div className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-500 opacity-50 ${
          isUnlocking ? 'bg-brand-accent scale-150 opacity-80' : 
          isHovered ? 'bg-brand-accent/40' : 'bg-brand-accent/10'
        }`} />

        <div className="relative flex items-center bg-black border-2 border-white/10 rounded-full px-1 py-1 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Unlocking Beam Effect */}
          <AnimatePresence>
            {isUnlocking && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent skew-x-12 z-10"
              />
            )}
          </AnimatePresence>

          {/* Icon/Dial Container */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-zinc-800 to-black p-0.5 flex-shrink-0">
            <motion.div
              animate={{ 
                rotate: isUnlocking ? 360 : isHovered ? 90 : 0,
                scale: isUnlocking ? 0.8 : 1
              }}
              transition={{ 
                duration: isUnlocking ? 0.8 : 0.5, 
                ease: "backOut" 
              }}
              className="w-full h-full rounded-full bg-black flex items-center justify-center border border-white/5 relative z-20 shadow-inner"
            >
              {isUnlocking ? (
                <Unlock className="w-5 h-5 text-brand-accent" />
              ) : (
                <Lock className="w-5 h-5 text-white/50 group-hover:text-brand-accent transition-colors" />
              )}
              
              {/* Radial Ticks */}
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-0.5 h-1.5 bg-white/10"
                  style={{ 
                    transform: `rotate(${i * 45}deg) translateY(-22px)`,
                    opacity: isHovered ? 1 : 0.3
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="px-6 flex flex-col justify-center gap-0.5">
             <div className="flex items-center gap-2">
                <span className="text-white font-black uppercase italic tracking-tighter text-sm">
                  {isUnlocking ? 'DECRYPTING...' : 'ENTER THE VAULT'}
                </span>
                {isHovered && !isUnlocking && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Zap className="w-3 h-3 text-brand-accent fill-brand-accent" />
                  </motion.div>
                )}
             </div>
             <div className="overflow-hidden h-3">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={isUnlocking ? 'decoding' : 'status'}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    exit={{ y: -20 }}
                    className="block text-[9px] font-black uppercase tracking-[0.2em] text-brand-accent"
                  >
                    {isUnlocking ? 'Blueprints Syncing' : 'Access Restricted'}
                  </motion.span>
                </AnimatePresence>
             </div>
          </div>

          <div className="pr-6">
            <Shield className={`w-4 h-4 transition-colors ${isUnlocking ? 'text-brand-accent animate-pulse' : 'text-white/20'}`} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
