import { NextResponse } from 'next/server';
import { generateMeetingSummary } from '@/lib/groq';

// In-memory rate limiting map
interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: Request) {
  try {
    // --- 1. Rate Limiting ---
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    
    let rateData = rateLimitMap.get(ip);
    
    if (!rateData || now > rateData.resetTime) {
      // Initialize or reset the rate limit for this IP
      rateData = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    } else {
      // Increment request count
      rateData.count++;
    }
    
    rateLimitMap.set(ip, rateData);

    if (rateData.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many requests, please wait a minute." },
        { status: 429 }
      );
    }

    // --- 2. Body Parsing & Validation ---
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { notes } = body;

    if (!notes || typeof notes !== 'string' || notes.trim() === '') {
      return NextResponse.json(
        { error: "The 'notes' field must be a non-empty string." },
        { status: 400 }
      );
    }

    if (notes.length > 8000) {
      return NextResponse.json(
        { error: "The 'notes' field cannot exceed 8000 characters." },
        { status: 400 }
      );
    }

    // --- 3. Generate Summary ---
    const summary = await generateMeetingSummary(notes);

    // --- 4. Return Success ---
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    // --- 5. Error Handling ---
    // Log the actual error to the server console for debugging
    console.error("Failed to generate summary in API route:", error);
    
    // Return a generic error message to the client
    return NextResponse.json(
      { error: "Something went wrong generating your summary. Please try again." },
      { status: 500 }
    );
  }
}
