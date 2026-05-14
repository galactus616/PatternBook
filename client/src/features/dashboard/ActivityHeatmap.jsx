import React, { useMemo, memo } from 'react';

const ActivityHeatmap = memo(({ data = [], selectedYear, onYearChange, availableYears = [2025, 2026] }) => {
  const activityMap = useMemo(() => {
    return data.reduce((acc, curr) => {
      acc[curr.date] = curr.count;
      return acc;
    }, {});
  }, [data]);

  // Generate weeks for the selected year
  const yearData = useMemo(() => {
    const weeks = [];
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    
    const firstDay = new Date(startDate);
    firstDay.setDate(startDate.getDate() - startDate.getDay());

    let currentDay = new Date(firstDay);
    while (currentDay <= endDate || weeks.length < 53) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDay.toISOString().split('T')[0];
        const isCurrentYear = currentDay.getFullYear() === selectedYear;
        week.push({
          date: dateStr,
          count: isCurrentYear ? (activityMap[dateStr] || 0) : -1
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(week);
      if (currentDay > endDate && weeks.length >= 52) break;
    }
    return weeks;
  }, [selectedYear, activityMap]);

  const getColor = (count) => {
    if (count === -1) return 'opacity-0 pointer-events-none'; 
    if (count === 0) return 'bg-rule/20 border-rule/10'; 
    if (count === 1) return 'bg-brand-red/30 border-brand-red/10'; 
    if (count === 2) return 'bg-brand-red/60 border-brand-red/20'; 
    return 'bg-brand-red border-brand-red/40 shadow-[0_0_12px_rgba(255,59,48,0.35)]'; 
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
          <h4 className="font-serif text-[18px] font-black text-ink">Consistency Log</h4>
        </div>
        
        <div className="flex bg-cream-dark/50 p-1 rounded-[4px] border border-rule/50">
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-3 py-1 rounded-[2px] font-mono text-[10px] font-bold transition-all cursor-pointer ${
                selectedYear === year 
                  ? "bg-ink text-cream shadow-sm" 
                  : "text-muted hover:text-ink"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-1.5 overflow-x-auto pb-4 no-scrollbar">
          {yearData.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1.5 shrink-0">
              {week.map((day, di) => (
                <div 
                  key={di}
                  title={day.count >= 0 ? `${day.date}: ${day.count} solved` : ''}
                  className={`w-[11px] h-[11px] rounded-[1.5px] border will-change-transform transition-all duration-200 hover:scale-125 hover:z-10 cursor-pointer ${getColor(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-rule/30">
        <p className="font-mono text-[8px] text-muted uppercase tracking-[0.2em]">
          Mastery visualization for {selectedYear}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] text-muted uppercase tracking-wider">Less</span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 rounded-[1px] bg-rule/20 border border-rule/10" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-brand-red/30 border border-brand-red/10" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-brand-red/60 border border-brand-red/20" />
            <div className="w-2.5 h-2.5 rounded-[1px] bg-brand-red border border-brand-red/40" />
          </div>
          <span className="font-mono text-[8px] text-muted uppercase tracking-wider">More</span>
        </div>
      </div>
    </div>
  );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';
export default ActivityHeatmap;
