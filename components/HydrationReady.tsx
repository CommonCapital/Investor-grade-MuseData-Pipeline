'use client';

import { useEffect, useState } from 'react';

export default function HydrationReady({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style jsx global>{`
        .hydration-wrap {
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .hydration-wrap.ready {
          opacity: 1;
        }
      `}</style>
      <div className={`hydration-wrap${mounted ? ' ready' : ''}`}>
        {children}
      </div>
    </>
  );
}