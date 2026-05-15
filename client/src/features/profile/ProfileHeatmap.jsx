import React, { useMemo, memo } from 'react';

const ProfileHeatmap = memo(({ data = [] }) => {
  const activityMap = useMemo(() => {
    return data.reduce((acc, curr) => {
      acc[curr.date] = curr.count;
      return acc;
    }, {});
  }, [data]);

  const year = new Date().getFullYear();

  const yearData = useMemo(() => {
    const weeks = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const firstDay = new Date(startDate);
    firstDay.setDate(startDate.getDate() - startDate.getDay());
    let currentDay = new Date(firstDay);
    while (currentDay <= endDate || weeks.length < 53) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDay.toISOString().split('T')[0];
        const isCurrentYear = currentDay.getFullYear() === year;
        week.push({ date: dateStr, count: isCurrentYear ? (activityMap[dateStr] || 0) : -1 });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(week);
      if (currentDay > endDate && weeks.length >= 52) break;
    }
    return weeks;
  }, [year, activityMap]);

  const getColor = (count) => {
    if (count === -1) return 'opacity-0 pointer-events-none';
    if (count === 0) return 'bg-rule/20 border-rule/10';
    if (count === 1) return 'bg-brand-red/30 border-brand-red/10';
    if (count === 2) return 'bg-brand-red/60 border-brand-red/20';
    return 'bg-brand-red border-brand-red/40 shadow-[0_0_10px_rgba(214,58,47,0.3)]';
  };

  return (
    <div className="w-full">
      <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
        {yearData.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 shrink-0">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.count >= 0 ? `${day.date}: ${day.count} solved` : ''}
                className={`w-[9px] h-[9px] rounded-[1px] border will-change-transform transition-colors duration-150 hover:scale-125 cursor-pointer ${getColor(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="font-mono text-[7px] text-muted/50 uppercase tracking-widest">Less</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-[1px] bg-rule/20 border border-rule/10" />
          <div className="w-2 h-2 rounded-[1px] bg-brand-red/30" />
          <div className="w-2 h-2 rounded-[1px] bg-brand-red/60" />
          <div className="w-2 h-2 rounded-[1px] bg-brand-red" />
        </div>
        <span className="font-mono text-[7px] text-muted/50 uppercase tracking-widest">More</span>
      </div>
    </div>
  );
});

ProfileHeatmap.displayName = 'ProfileHeatmap';
export default ProfileHeatmap;
