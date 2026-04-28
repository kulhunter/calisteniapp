import React from 'react';

export function BioDigitalModel() {
  const widgetUrl = "https://human.biodigital.com/widget/?be=2PcB&background.colors=0,0,0,1,0,0,0,1&initial.hand-hint=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&ui-info=true&uaid=3YfOR";

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Decorative Overlays to blend with the app */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent opacity-80" />
      </div>

      <iframe
        src={widgetUrl}
        title="BioDigital Human Model"
        className="w-full h-full"
        allowFullScreen
        allow="vr; xr; accelerometer; gyroscope"
      />
      
      {/* Callout Mockups to simulate the reference look */}
      <div className="absolute top-1/4 right-1/4 pointer-events-none z-20 group">
        <div className="relative">
          <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
          <div className="w-3 h-3 bg-primary rounded-full absolute inset-0" />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 glass-panel p-2 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Hombros: Mantener estables
          </div>
        </div>
      </div>
    </div>
  );
}
