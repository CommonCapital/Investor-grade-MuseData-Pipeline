import { useState, useCallback } from "react";
import { TimeHorizon } from "@/lib/seo-schema";

interface UseTimeHorizonReturn {
  horizon: TimeHorizon;
  setHorizon: (h: TimeHorizon) => void;
  isTransitioning: boolean;
}

export function useTimeHorizon(): UseTimeHorizonReturn {
  const [horizon, setHorizonState] = useState<TimeHorizon>("1M");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle horizon change with transition animation
  const setHorizon = useCallback((newHorizon: TimeHorizon) => {
    if (newHorizon === horizon) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setHorizonState(newHorizon);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  }, [horizon]);
  
  return {
    horizon,
    setHorizon,
    isTransitioning,
  };
}
