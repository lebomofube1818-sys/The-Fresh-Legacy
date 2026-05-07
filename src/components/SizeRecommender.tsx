import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { geminiService } from '@/services/geminiService';
import { Loader2, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SizeRecommenderProps {
  productName: string;
}

export default function SizeRecommender({ productName }: SizeRecommenderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ recommendedSize: string, explanation: string } | null>(null);
  
  // Form State
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [footWidth, setFootWidth] = useState('standard');
  const [preferredFit, setPreferredFit] = useState('standard');

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('tfl_user_size_profile');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHeight(data.height?.toString() || '175');
        setWeight(data.weight?.toString() || '70');
        setFootWidth(data.footWidth || 'standard');
        setPreferredFit(data.preferredFit || 'standard');
      } catch (e) {
        console.error("Failed to load size profile", e);
      }
    }
  }, []);

  const handleRecommend = async () => {
    setLoading(true);
    setResult(null);
    
    const profile = {
      height: Number(height),
      weight: Number(weight),
      footWidth,
      preferredFit,
      targetModel: productName
    };

    // Save to localStorage
    localStorage.setItem('tfl_user_size_profile', JSON.stringify(profile));

    const res = await geminiService.recommendSize(profile);
    setResult(res);
    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <button className="text-sm font-semibold underline hover:text-gray-600 flex items-center gap-1">
            <Ruler className="w-4 h-4" />
            Find My Size
          </button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">AI Size Recommender</DialogTitle>
          <DialogDescription>
            Gemini will analyze your measurements to find the perfect fit for <strong>{productName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input 
                id="height" 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input 
                id="weight" 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Foot Width</Label>
            <Select value={footWidth} onValueChange={setFootWidth}>
              <SelectTrigger>
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="narrow">Narrow (B)</SelectItem>
                <SelectItem value="standard">Standard (D)</SelectItem>
                <SelectItem value="wide">Wide (2E/4E)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Preferred Fit</Label>
            <RadioGroup value={preferredFit} onValueChange={setPreferredFit} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tight" id="fit-tight" />
                <Label htmlFor="fit-tight" className="font-normal">Tight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="fit-standard" />
                <Label htmlFor="fit-standard" className="font-normal">True to Size</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loose" id="fit-loose" />
                <Label htmlFor="fit-loose" className="font-normal">Loose</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-brand-primary text-white p-4 rounded-lg space-y-2 overflow-hidden"
            >
              <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Recommended Size</p>
              <h4 className="text-3xl font-black italic">US {result.recommendedSize}</h4>
              <p className="text-sm border-t border-white/20 pt-2 text-white/90">
                {result.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            className="bg-brand-accent text-white hover:bg-orange-600 min-w-[140px]" 
            onClick={handleRecommend}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : "Get Recommendation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
