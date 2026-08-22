'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">System error</p>
        <h1 className="mt-2 text-3xl font-bold">This view could not load</h1>
        <p className="mt-3 text-muted-foreground">The operation was stopped safely. Retry the view or return to the dashboard.</p>
        <button type="button" onClick={reset} className="mt-6 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
          Retry
        </button>
      </div>
    </main>
  );
}
