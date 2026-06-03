import React from 'react';
import { useDashboard } from '../features/dashboard/useDashboard';
import DashboardHero from '../features/dashboard/DashboardHero';
import MasteryStats from '../features/dashboard/MasteryStats';
import RecentActivity from '../features/dashboard/RecentActivity';
import TopicMasteryList from '../features/dashboard/TopicMasteryList';
import PatternRadar from '../features/dashboard/PatternRadar';
import ActivityHeatmap from '../features/dashboard/ActivityHeatmap';

const Skel = ({ h = 'h-32', cols = '' }) => (
  <div className={`${h} ${cols} bg-rule/10 rounded-[4px] animate-pulse`} />
);

const DashboardPage = () => {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const { data: stats, isLoading } = useDashboard(year);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 pt-8 pb-14 space-y-6">
        <Skel h="h-[260px]" />
        <Skel h="h-[180px]" />
        <Skel h="h-[200px]" />
        <div className="grid grid-cols-12 gap-6">
          <Skel h="h-[440px]" cols="col-span-4" />
          <Skel h="h-[440px]" cols="col-span-4" />
          <Skel h="h-[440px]" cols="col-span-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 pt-8 pb-14 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {/* Row 1: Hero */}
      <DashboardHero stats={stats} />

      {/* Row 2: Difficulty breakdown */}
      <MasteryStats stats={stats} />

      {/* Row 3: Heatmap */}
      <div className="bg-white border border-rule rounded-[4px] p-8 shadow-sm">
        <ActivityHeatmap
          data={stats?.heatmapData}
          selectedYear={year}
          onYearChange={setYear}
          availableYears={stats?.availableYears}
        />
      </div>

      {/* Row 4: Topics | Radar | Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4 h-[460px]">
          <TopicMasteryList topics={stats?.topicProgress} />
        </div>

        <div className="lg:col-span-4 h-[460px]">
          <div className="bg-white border border-rule rounded-[4px] shadow-sm h-full flex flex-col">
            <div className="px-6 py-4 border-b border-rule bg-cream-dark/20 shrink-0 flex items-center justify-between">
              <h3 className="font-serif text-[18px] font-black text-ink">Pattern Radar</h3>
              <p className="font-mono text-[9px] text-muted uppercase tracking-widest">Top 7 by mastery</p>
            </div>
            <div className="flex-1 min-h-0 p-4">
              <PatternRadar data={stats?.patternMastery} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 h-[460px]">
          <RecentActivity activity={stats?.recentActivity} />
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;