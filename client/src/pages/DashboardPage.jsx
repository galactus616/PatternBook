import React from 'react';
import { useDashboard } from '../features/dashboard/useDashboard';
import DashboardHero from '../features/dashboard/DashboardHero';
import MasteryStats from '../features/dashboard/MasteryStats';
import RecentActivity from '../features/dashboard/RecentActivity';
import TopicMasteryList from '../features/dashboard/TopicMasteryList';
import PatternRadar from '../features/dashboard/PatternRadar';
import ActivityHeatmap from '../features/dashboard/ActivityHeatmap';
import Skeleton from '../components/ui/Skeleton';

const DashboardPage = () => {
  const [year, setYear] = React.useState(new Date().getFullYear());
  const { data: stats, isLoading } = useDashboard(year);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 space-y-10 animate-in fade-in duration-500 pt-8">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 pb-10">
      {/* Personalized Welcome & Overall Progress */}
      <DashboardHero stats={stats} />

      {/* Heatmap Section - Now full 365 days with year filter */}
      <div className="bg-white border border-rule rounded-[4px] p-8 shadow-sm">
        <ActivityHeatmap 
          data={stats?.heatmapData} 
          selectedYear={year}
          onYearChange={setYear}
          availableYears={stats?.availableYears}
        />
      </div>

      {/* Mastery Breakdown Cards - Redesigned for modern look */}
      <MasteryStats stats={stats} />

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Topic Progress - Now a compact 2-column grid */}
        <div className="lg:col-span-4 h-[440px]">
          <TopicMasteryList topics={stats?.topicProgress} />
        </div>

        {/* Center: Pattern Radar Chart */}
        <div className="lg:col-span-4 bg-white border border-rule rounded-[4px] p-6 shadow-sm h-[440px] flex flex-col">
           <div className="flex items-center justify-between mb-6 shrink-0">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
               <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Pattern Mastery</p>
             </div>
             <p className="font-mono text-[8px] text-muted/50 uppercase tracking-widest italic">Live Distribution</p>
           </div>
           <div className="flex-1">
             <PatternRadar data={stats?.patternMastery} />
           </div>
           <p className="font-mono text-[8px] text-muted uppercase tracking-wider mt-4 text-center shrink-0">
             Top 7 Patterns by Mastery %
           </p>
        </div>

        {/* Right: Recent Activity */}
        <div className="lg:col-span-4 h-[440px]">
          <RecentActivity activity={stats?.recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;