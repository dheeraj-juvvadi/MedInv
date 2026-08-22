import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl font-bold">Record not found</h1>
        <p className="mt-3 text-muted-foreground">This clinical console route does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground">
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
