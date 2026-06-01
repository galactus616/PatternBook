import React from 'react';
import { Link } from 'react-router-dom';

export default function NotAuthorized() {
  return (
    <div className="flex h-screen items-center justify-center bg-cream">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-ink mb-2">Access Denied</h1>
        <p className="text-muted text-sm mb-6">
          You don't have permission to view this page. Admin access is required.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
