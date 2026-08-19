'use client';

import React, { useState } from 'react';

interface ResultsDisplayProps {
  summary: string;
  actionItems: string[];
  followUpEmail: string;
}

export default function ResultsDisplay({ summary, actionItems, followUpEmail }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(followUpEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-10 animate-slide-up">
      {/* Summary Section */}
      <div className="relative pt-3">
        <div className="absolute top-0 left-4 bg-accent-action text-white text-xs font-heading px-3 py-1 font-medium z-10 border border-accent-action rounded-t-sm">
          Summary
        </div>
        <div className="bg-card border border-hairline rounded p-6 pt-7 relative z-0">
          <p className="font-body text-ink leading-relaxed">
            {summary}
          </p>
        </div>
      </div>

      {/* Action Items Section */}
      <div className="relative pt-3">
        <div className="absolute top-0 left-4 bg-accent-highlight text-ink text-xs font-heading px-3 py-1 font-medium z-10 border border-accent-highlight rounded-t-sm">
          Action items
        </div>
        <div className="bg-card border border-hairline rounded p-6 pt-7 relative z-0">
          <ul className="space-y-3">
            {actionItems.map((item, index) => (
              <li key={index} className="flex items-start font-body text-ink">
                <span className="mr-3 mt-1.5 w-3 h-3 flex-shrink-0 border border-ink rounded-sm"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Follow-up Email Section */}
      <div className="relative pt-3">
        <div className="absolute top-0 left-4 bg-accent-action text-white text-xs font-heading px-3 py-1 font-medium z-10 border border-accent-action rounded-t-sm">
          Follow-up email
        </div>
        <div className="bg-card border border-hairline rounded p-6 pt-7 relative z-0">
          <button
            onClick={handleCopy}
            className="absolute top-5 right-5 text-xs font-body text-accent-action hover:opacity-80 transition-opacity"
          >
            {copied ? "Copied" : "Copy to clipboard"}
          </button>
          <div className="mt-4 bg-[#FBFBFB] border border-hairline p-5 rounded">
            <pre className="font-mono text-sm text-ink whitespace-pre-wrap leading-relaxed">
              {followUpEmail}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
