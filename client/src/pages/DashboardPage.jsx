import React from 'react';
import { useDashboard } from '../features/dashboard/useDashboard';
import DashboardHero from '../features/dashboard/DashboardHero';
import MasteryStats from '../features/dashboard/MasteryStats';
import RecentActivity from '../features/dashboard/RecentActivity';
import TopicMasteryList from '../features/dashboard/TopicMasteryList';
import Skeleton from '../components/ui/Skeleton';

const DashboardPage = () => {
  const { data: stats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Personalized Welcome & Overall Progress */}
      <DashboardHero stats={stats} />

      {/* Mastery Breakdown Cards */}
      <MasteryStats stats={stats} />

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left: Topic Progress (Smaller col) */}
        <div className="lg:col-span-2">
          <TopicMasteryList topics={stats?.topicProgress} />
        </div>

        {/* Right: Recent Activity (Larger col) */}
        <div className="lg:col-span-3">
          <RecentActivity activity={stats?.recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;