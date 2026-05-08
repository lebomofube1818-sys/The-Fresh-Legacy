import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Smartphone, MapPin, Loader2, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/AuthContext';
import { Badge } from '@/components/ui/badge';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { loginWithEmail, signUpWithEmail, loginWithGoogle } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    mobileNumber: '',
    shippingAddress: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await loginWithEmail(formData.email, formData.password);
      } else {
        await signUpWithEmail(
          formData.email, 
          formData.password, 
          formData.displayName,
          {
            mobileNumber: formData.mobileNumber,
            shippingAddress: formData.shippingAddress
          }
        );
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
       setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-12 custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 cursor-zoom-out"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.4)] overflow-hidden my-auto shrink-0"
      >
        <button 
          onClick={onClose}
          className="absolute top-10 right-10 p-3 hover:bg-zinc-100 rounded-full transition-all z-20 group"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </button>

        <div className="flex flex-col md:flex-row min-h-[650px]">
          {/* Left Side - Visual Story */}
          <div className="hidden md:flex w-[42%] bg-black p-14 flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-brand-accent text-white border-none uppercase text-[10px] font-black tracking-[0.3em] px-5 py-2 mb-10 shadow-[0_0_20px_rgba(255,59,48,0.3)]">
                    EST. 2024 COLLECTIVE
                  </Badge>
                  <h2 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-[0.8] mb-4">
                    BECOME <br/> THE <br/> LEGACY
                  </h2>
                </motion.div>
             </div>
             
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="relative z-10 space-y-8"
             >
                <div className="h-[3px] w-20 bg-brand-accent rounded-full" />
                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.25em] leading-[1.8] max-w-[240px]">
                  Join the foundation. Secure your position in the archival registry for priority access.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                     {[1, 2, 3, 4].map(i => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.7 + (i * 0.1) }}
                         className="w-12 h-12 rounded-full border-4 border-black bg-zinc-900 flex items-center justify-center ring-1 ring-white/10"
                       >
                         <User className="w-5 h-5 text-white/10" />
                       </motion.div>
                     ))}
                  </div>
                  <span className="text-[10px] font-black text-white/30 tracking-widest uppercase">Member Rank</span>
                </div>
             </motion.div>

             {/* Dynamic Background */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22rem] font-black italic text-white/[0.03] select-none pointer-events-none tracking-tighter leading-none pr-10">
                LGCY
             </div>
             <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />
          </div>

          {/* Right Side - Functional Interface */}
          <div className="flex-1 p-10 md:p-20 bg-white">
            <motion.div 
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-14"
            >
              <button 
                onClick={onClose}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300 hover:text-black transition-all mb-10 group"
              >
                <div className="p-2 rounded-full border border-zinc-100 group-hover:border-zinc-200 group-hover:bg-zinc-50 transition-all">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Return to Shop
              </button>

              <div className="space-y-4">
                <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                  {mode === 'login' ? 'IDENTITY / ACCESS' : 'MANIFEST / REGISTER'}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-12 bg-brand-accent rounded-full" />
                  <p className="text-xs text-zinc-400 font-bold font-mono uppercase tracking-[0.2em]">
                    {mode === 'login' ? 'Continue archival journey' : 'Initialize collection status'}
                  </p>
                </div>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-8 overflow-hidden"
                  >
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Full Identity Name</label>
                      <div className="relative group">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                        <Input
                          required={mode === 'signup'}
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                          className="bg-zinc-50 border-zinc-100 rounded-[1.5rem] pl-16 h-16 text-sm font-bold focus:ring-4 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-300 uppercase tracking-tight"
                          placeholder="ENTER FULL NAME"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Archive Contact</label>
                        <div className="relative group">
                          <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                          <Input
                            required={mode === 'signup'}
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            className="bg-zinc-50 border-zinc-100 rounded-[1.5rem] pl-16 h-16 text-sm font-bold focus:ring-4 focus:ring-black/5 transition-all font-mono placeholder:text-zinc-300"
                            placeholder="+27 000 000 0000"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Geographical Node</label>
                        <div className="relative group">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                          <Input
                            required={mode === 'signup'}
                            value={formData.shippingAddress}
                            onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                            className="bg-zinc-50 border-zinc-100 rounded-[1.5rem] pl-16 h-16 text-sm font-bold focus:ring-4 focus:ring-black/5 transition-all placeholder:text-zinc-300 uppercase tracking-tight"
                            placeholder="CITY, ZIP CODE"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Secure Portal Email</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-zinc-50 border-zinc-100 rounded-[1.5rem] pl-16 h-16 text-sm font-bold focus:ring-4 focus:ring-black/5 transition-all font-mono placeholder:text-zinc-300 uppercase"
                    placeholder="EMAIL@LEGACY.COM"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Vault Key</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 group-focus-within:text-black transition-colors" />
                  <Input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-zinc-50 border-zinc-100 rounded-[1.5rem] pl-16 pr-16 h-16 text-sm font-bold focus:ring-4 focus:ring-black/5 transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-4 text-[11px] font-bold text-red-500 bg-red-50 p-5 rounded-[1.5rem] border border-red-100 shadow-sm"
                >
                  <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  {error}
                </motion.div>
              )}

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white hover:bg-zinc-900 rounded-[1.5rem] py-9 text-[12px] font-black uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        {mode === 'login' ? 'AUTHORIZE ACCESS' : 'INITIALIZE ARCHIVE'} 
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                      </>
                    )}
                  </span>
                </Button>
              </div>

              <div className="relative py-12">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-100"></span>
                </div>
                <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.5em] text-zinc-300">
                  <span className="bg-white px-8">Sync Identity Provider</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                disabled={loading}
                onClick={handleGoogleLogin}
                className="w-full rounded-[1.5rem] py-9 border-zinc-100 hover:bg-zinc-50 hover:border-zinc-300 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 group"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-500" />
                Proceed with Google Account
              </Button>

              <div className="pt-16 text-center">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  {mode === 'login' ? "New arrival at the collective?" : "Already verified by archival?"}
                  <button 
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="ml-4 text-brand-accent hover:text-black border-b-2 border-brand-accent/20 hover:border-black transition-all font-black italic pb-1"
                  >
                    {mode === 'login' ? 'CREATE LEGACY' : 'LOG INTO IDENTITY'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
