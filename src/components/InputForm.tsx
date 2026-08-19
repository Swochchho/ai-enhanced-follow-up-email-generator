'use client';

import React from 'react';

interface InputFormProps {
  notes: string;
  setNotes: (notes: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export default function InputForm({ notes, setNotes, onSubmit, isLoading, error }: InputFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4">
      <div className="relative">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste your raw meeting notes or transcript here..."
          className="w-full h-72 p-4 pt-5 font-mono text-sm bg-card border border-hairline rounded focus:outline-none focus:border-accent-action resize-y"
          style={{
            lineHeight: '28px',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, #E4E0D6 27px, #E4E0D6 28px)',
            backgroundAttachment: 'local'
          }}
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !notes.trim()}
        className="self-start px-5 py-2.5 bg-accent-action text-white font-heading font-medium rounded hover:bg-[#238276] disabled:opacity-70 transition-colors"
      >
        {isLoading ? "Generating..." : "Generate summary"}
      </button>

      {error && (
        <div className="mt-2 pl-3 py-1 border-l-2 border-[#D97777] text-ink text-sm font-body bg-transparent">
          {error}
        </div>
      )}
    </form>
  );
}
