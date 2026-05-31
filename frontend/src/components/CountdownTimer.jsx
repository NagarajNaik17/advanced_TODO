import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const CountdownTimer = () => {
  const [timers, setTimers] = useState({
    day: { h: '00', m: '00', s: '00' },
    week: { d: '0', h: '00', m: '00', s: '00' },
    month: { d: '0', h: '00', m: '00', s: '00' },
    year: { d: '0', h: '00', m: '00', s: '00' }
  });

  useEffect(() => {
    const updateCountdowns = () => {
      const now = dayjs();

      // --- Day Countdown ---
      const endOfDay = now.endOf('day');
      const diffDay = endOfDay.diff(now);
      const durDay = dayjs.duration(diffDay);
      
      // --- Week Countdown ---
      const endOfWeek = now.endOf('week'); // end of week (usually Sunday 23:59:59)
      const diffWeek = endOfWeek.diff(now);
      const durWeek = dayjs.duration(diffWeek);

      // --- Month Countdown ---
      const endOfMonth = now.endOf('month');
      const diffMonth = endOfMonth.diff(now);
      const durMonth = dayjs.duration(diffMonth);

      // --- Year Countdown ---
      const endOfYear = now.endOf('year');
      const diffYear = endOfYear.diff(now);
      const durYear = dayjs.duration(diffYear);

      const pad = (num) => String(Math.floor(num)).padStart(2, '0');

      setTimers({
        day: {
          h: pad(durDay.asHours()),
          m: pad(durDay.minutes()),
          s: pad(durDay.seconds())
        },
        week: {
          d: String(Math.floor(durWeek.asDays())),
          h: pad(durWeek.hours()),
          m: pad(durWeek.minutes()),
          s: pad(durWeek.seconds())
        },
        month: {
          d: String(Math.floor(durMonth.asDays())),
          h: pad(durMonth.hours()),
          m: pad(durMonth.minutes()),
          s: pad(durMonth.seconds())
        },
        year: {
          d: String(Math.floor(durYear.asDays())),
          h: pad(durYear.hours()),
          m: pad(durYear.minutes()),
          s: pad(durYear.seconds())
        }
      });
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

    return () => clearInterval(interval);
  }, []);

  const Card = ({ label, timeValues }) => (
    <div className="glass-panel p-4 rounded-xl flex flex-col justify-between items-center text-center">
      <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">{label}</span>
      <div className="mt-2 flex items-baseline justify-center gap-1">
        {timeValues.d !== undefined && (
          <>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent">{timeValues.d}</span>
            <span className="text-[10px] text-slate-500 mr-1">d</span>
          </>
        )}
        <span className="text-xl font-bold text-slate-100">{timeValues.h}</span>
        <span className="text-[10px] text-slate-500">:</span>
        <span className="text-xl font-bold text-slate-100">{timeValues.m}</span>
        <span className="text-[10px] text-slate-500">:</span>
        <span className="text-xl font-bold text-accent-cyan">{timeValues.s}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Day Countdown" timeValues={timers.day} />
      <Card label="Week Countdown" timeValues={timers.week} />
      <Card label="Month Countdown" timeValues={timers.month} />
      <Card label="Year Countdown" timeValues={timers.year} />
    </div>
  );
};

export default CountdownTimer;
