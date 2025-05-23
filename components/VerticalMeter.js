import React from 'react'

const MeterBase = (props) => {
    const animated = true;
    const percentage = Math.min(Math.max(((props.value - 0) / (100)) * 100, 0), 100);
    const getGradientColors = () => {
    if (percentage <= 25) {
      return 'from-red-500 to-red-400';
    } else if (percentage <= 50) {
      return 'from-orange-500 via-red-500 to-red-400';
    } else if (percentage <= 75) {
      return 'from-yellow-400 via-orange-500 to-red-400';
    } else {
      return 'from-green-400 via-yellow-400 via-orange-500 to-red-400';
    }
  };
  return (
    <div>
       <div 
        className="relative bg-gray-200 rounded-full overflow-hidden shadow-inner"
      >
        {/* Background gradient (full scale) */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-400 via-orange-500 via-yellow-400 to-green-400 opacity-20" />
        
        {/* Filled portion */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getGradientColors()} ${animated ? 'transition-all duration-700 ease-out' : ''}`}
          style={{ height: `${percentage}%` }}
        />
        
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 rounded-full" />
        
        {/* Top cap */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full" />
      </div>
    </div>
  )
}


const VerticalMeter = ({ value}) => {
  return (
    <div className="flex justify-center items-end space-x-8 relative">
      <MeterBase value={value} />
    </div>
  );
};

export default VerticalMeter
