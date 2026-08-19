# Meeting Notes Assistant

This application takes your raw, messy meeting notes or transcripts and instantly formats them into a clean summary, a list of concrete action items, and a professional follow-up email draft. It is designed with a minimalistic, distraction-free interface to streamline your post-meeting workflow.

## Setting up the API Key

This application uses the Groq API to generate the formatted meeting notes.

**Running Locally:**
1. Create a `.env.local` file in the root directory.
2. Add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

**Deploying on Vercel:**
1. In your Vercel dashboard, go to the **Project Settings**.
2. Navigate to the **Environment Variables** tab.
3. Add a new variable with the key `GROQ_API_KEY` and your actual API key as the value.

## Privacy Note
No user data, raw meeting notes, or generated summaries are stored in a database or logged anywhere in this application. All processing is handled in-memory and securely passed to the LLM API.
