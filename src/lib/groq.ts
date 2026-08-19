export interface MeetingSummary {
  summary: string;
  actionItems: string[];
  followUpEmail: string;
}

export async function generateMeetingSummary(rawNotes: string): Promise<MeetingSummary> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }

  // Silently truncate raw notes to a maximum of 6000 characters
  const truncatedNotes = rawNotes.substring(0, 6000);

  const systemPrompt = `You are a meeting notes assistant. Given raw, messy meeting notes or a transcript, produce three sections: 1) SUMMARY - a 3-5 sentence plain-language summary, 2) ACTION_ITEMS - a bulleted list of concrete action items with owner names if mentioned in the notes, 3) FOLLOW_UP_EMAIL - a short, professional follow-up email draft recapping the meeting and next steps. Respond ONLY with valid JSON in this exact shape: {"summary": string, "actionItems": string[], "followUpEmail": string}. No markdown, no code fences, no extra commentary outside the JSON.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 0.4,
        max_tokens: 1000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: truncatedNotes },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid API response format: missing content.");
    }

    const parsed = JSON.parse(content) as MeetingSummary;

    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate meeting summary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the meeting summary.");
  }
}
