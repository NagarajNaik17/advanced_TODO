import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());
  const [countdown, setCountdown] = useState('00h 00m 00s');
  const requestRef = useRef();

  // Smooth ticking animation loop
  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      requestRef.current = requestAnimationFrame(tick);
    };
    requestRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Update countdown timer once a second
  useEffect(() => {
    const updateCountdown = () => {
      const now = dayjs();
      const endOfDay = now.endOf('day');
      const diff = endOfDay.diff(now);
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (num) => String(num).padStart(2, '0');
      setCountdown(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute angles
  const date = time;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ms = date.getMilliseconds();

  const secondAngle = (seconds * 6) + (ms * 0.006);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);

  // Time-of-day color rules:
  // Morning (6 AM - 12 PM) -> Green
  // Afternoon (12 PM - 6 PM) -> Orange
  // Night (6 PM - 6 AM) -> Red
  const getColorScheme = () => {
    if (hours >= 6 && hours < 12) {
      return {
        color: '#10B981', // Green
        label: 'Morning Focus',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
        glow: 'shadow-glowEmerald'
      };
    } else if (hours >= 12 && hours < 18) {
      return {
        color: '#F59E0B', // Orange
        label: 'Afternoon Energy',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        glow: 'shadow-glow'
      };
    } else {
      return {
        color: '#EF4444', // Red
        label: 'Night Relaxation',
        border: 'border-red-500/30',
        text: 'text-rose-400',
        glow: 'shadow-glow'
      };
    }
  };

  const scheme = getColorScheme();

  // Draw 12 clock markers
  const markers = [];
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const isMajor = i % 3 === 0;
    const length = isMajor ? 8 : 4;
    markers.push(
      <line
        key={i}
        x1="100"
        y1={20}
        x2="100"
        y2={20 + length}
        transform={`rotate(${angle} 100 100)`}
        stroke={isMajor ? '#94a3b8' : '#475569'}
        strokeWidth={isMajor ? 1.5 : 1}
      />
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
      {/* Dynamic Time Slot Indicator */}
      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-lightBorder dark:border-darkBorder/40 mb-4`}>
        {scheme.label}
      </span>

      {/* SVG Analog Clock canvas */}
      <div className={`relative w-40 h-40 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-4 ${scheme.border} transition-all duration-300`}>
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          {/* Outer Ring Glow */}
          <circle cx="100" cy="100" r="96" fill="none" stroke={scheme.color} strokeOpacity="0.1" strokeWidth="8" />
          <circle cx="100" cy="100" r="92" fill="none" stroke="#334155" strokeWidth="0.5" />

          {/* Clock Ticks */}
          {markers}

          {/* Hour Hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="55"
            stroke="#94a3b8"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform={`rotate(${hourAngle} 100 100)`}
          />

          {/* Minute Hand */}
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="40"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} 100 100)`}
          />

          {/* Second Hand (Smooth) */}
          <line
            x1="100"
            y1="115"
            x2="100"
            y2="30"
            stroke={scheme.color}
            strokeWidth="1"
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 100 100)`}
          />

          {/* Center Pin */}
          <circle cx="100" cy="100" r="4" fill={scheme.color} />
          <circle cx="100" cy="100" r="1.5" fill="#ffffff" />
        </svg>
      </div>

      {/* Day Countdown Container */}
      <div className="mt-4 space-y-1">
        <span className="text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase font-bold">
          Day Ends In
        </span>
        <p className={`text-xl font-black ${scheme.text} font-mono tracking-wide`}>
          {countdown}
        </p>
      </div>
    </div>
  );
};

export default AnalogClock;
