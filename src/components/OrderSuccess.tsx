import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Package, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSuccessProps {
  onContinue: () => void;
}

export default function OrderSuccess({ onContinue }: OrderSuccessProps) {
  const orderNumber = Math.floor(Math.random() * 900000000) + 100000000;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-20">
      <div className="tfl-container max-w-2xl text-center">
        <motion.div
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", damping: 12 }}
           className="mb-12 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full blur-2xl opacity-50 animate-pulse" />
            <CheckCircle2 className="w-32 h-32 text-green-500 relative z-10" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
            Order <br /> <span className="text-brand-accent">Confirmed</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium">
            Get ready to move. Your gear is on its way.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-8">
            <div className="bg-gray-50 p-6 rounded-2xl border text-left">
              <Package className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Number</p>
              <p className="font-bold text-sm tracking-tight">#{orderNumber}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border text-left">
              <Box className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Delivery</p>
              <p className="font-bold text-sm tracking-tight">May 14, 2026</p>
            </div>
          </div>

          <div className="pt-10">
            <Button 
              onClick={onContinue}
              className="bg-brand-primary text-white hover:bg-gray-800 rounded-full px-12 py-8 text-lg font-black uppercase italic tracking-tighter transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4 mx-auto"
            >
              Continue Shopping
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-400 font-medium pt-8">
            A confirmation email has been sent to your inbox.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
