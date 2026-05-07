import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterState {
  priceRange: [number, number];
  genders: string[];
  styles: string[];
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 300 }
  },
} as const;

export default function FilterSheet({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}: FilterSheetProps) {
  const handlePriceChange = (value: number[]) => {
    if (value && value.length > 0) {
      onFilterChange({ ...filters, priceRange: [0, value[0]] });
    }
  };

  const toggleGender = (gender: string) => {
    const genders = filters.genders || [];
    const nextGenders = genders.includes(gender)
      ? genders.filter((g) => g !== gender)
      : [...genders, gender];
    onFilterChange({ ...filters, genders: nextGenders });
  };

  const toggleStyle = (style: string) => {
    const styles = filters.styles || [];
    const nextStyles = styles.includes(style)
      ? styles.filter((s) => s !== style)
      : [...styles, style];
    onFilterChange({ ...filters, styles: nextStyles });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l border-gray-100 bg-white">
        <SheetHeader className="p-6 border-b border-gray-50 flex flex-row items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="space-y-1">
            <SheetTitle className="font-black italic uppercase tracking-tighter text-3xl leading-none">Filters</SheetTitle>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Refine your legacy</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-100 transition-all hover:rotate-90">
            <X className="w-5 h-5" />
          </Button>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="px-8 py-10 space-y-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {/* Price Range */}
                <motion.div variants={itemVariants} className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Price Ceiling</h3>
                      <p className="text-[10px] text-gray-300 uppercase tracking-widest">Adjust max budget</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black italic tracking-tighter text-brand-primary">
                        R{filters.priceRange?.[1]?.toLocaleString() ?? filters.priceRange?.[1] ?? '0'}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2 px-2">
                    <Slider
                      value={[filters.priceRange?.[1] ?? 5000]}
                      max={5000}
                      step={100}
                      onValueChange={handlePriceChange}
                      className="py-4"
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">R0</span>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">R5,000+</span>
                    </div>
                  </div>
                </motion.div>

                <Separator className="bg-gray-50" />

                {/* Gender */}
                <motion.div variants={itemVariants} className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Gender</h3>
                      <p className="text-[10px] text-gray-300 uppercase tracking-widest">Select your fit</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {['men', 'women', 'kids', 'unisex'].map((gender) => (
                      <motion.div 
                        key={gender} 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          (filters.genders || []).includes(gender) 
                            ? 'border-brand-accent bg-brand-accent/5' 
                            : 'border-gray-50 hover:border-gray-200'
                        }`} 
                        onClick={() => toggleGender(gender)}
                      >
                        <Checkbox 
                          id={`gender-${gender}`} 
                          checked={(filters.genders || []).includes(gender)}
                          className="border-2 border-gray-200 data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent rounded-full w-5 h-5"
                        />
                        <label
                          htmlFor={`gender-${gender}`}
                          className={`text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer transition-colors ${
                            (filters.genders || []).includes(gender) ? 'text-brand-accent' : 'text-gray-500'
                          }`}
                        >
                          {gender}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <Separator className="bg-gray-50" />

                {/* Style / Sport */}
                <motion.div variants={itemVariants} className="space-y-8">
                  <div className="space-y-1">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400">Aesthetic</h3>
                    <p className="text-[10px] text-gray-300 uppercase tracking-widest">Filter by vibe</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {['lifestyle', 'running', 'basketball', 'training'].map((style) => (
                      <motion.div 
                        key={style} 
                        whileHover={{ x: 5 }}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                          (filters.styles || []).includes(style) 
                            ? 'border-brand-primary bg-brand-primary text-white shadow-lg' 
                            : 'border-gray-50 hover:border-gray-100 hover:bg-gray-50'
                        }`} 
                        onClick={() => toggleStyle(style)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-2 h-2 rounded-full transition-all ${
                            (filters.styles || []).includes(style) ? 'bg-brand-accent animate-pulse' : 'bg-gray-200'
                          }`} />
                          <label
                            htmlFor={`style-${style}`}
                            className="text-xs font-black uppercase tracking-[0.25em] cursor-pointer"
                          >
                            {style}
                          </label>
                        </div>
                        {(filters.styles || []).includes(style) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-brand-accent text-white p-1 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <SheetFooter className="p-8 border-t border-gray-50 grid grid-cols-2 gap-4 bg-white">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-14 border-2 hover:bg-gray-50 group"
          >
            <RotateCcw className="w-3 h-3 mr-2 transition-transform group-hover:-rotate-180" />
            Reset
          </Button>
          <Button 
            onClick={onClose}
            className="rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] h-14 bg-brand-primary text-white hover:bg-gray-800 shadow-xl shadow-brand-primary/10 transition-all hover:scale-[1.02] active:scale-95"
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

