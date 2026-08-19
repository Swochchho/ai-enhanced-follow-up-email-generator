'use client';

import React, { useState } from 'react';
import InputForm from '@/components/InputForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { MeetingSummary } from '@/lib/groq';

export default function Home() {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MeetingSummary | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-[640px] mx-auto px-6 py-16 space-y-12">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-bold text-ink tracking-tight text-left">
          Meeting notes in. Action items out.
        </h1>
        <p className="font-body text-ink/80 text-lg">
          Paste your notes, get a summary, action items, and a follow-up email draft.
        </p>
      </header>

      <section>
        <InputForm
          notes={notes}
          setNotes={setNotes}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </section>

      {results && (
        <section>
          <ResultsDisplay
            summary={results.summary}
            actionItems={results.actionItems}
            followUpEmail={results.followUpEmail}
          />
        </section>
      )}
    </main>
  );
}
