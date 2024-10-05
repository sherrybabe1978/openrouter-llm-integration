import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model: string;
  // Add other parameters as needed
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  // Add other fields as needed
}

const API_URL = process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL || "meta-llama/llama-3.2-1b-instruct:free";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log('Received message:', message);

    if (!message) {
      console.log('No message provided');
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const chatRequest: ChatRequest = {
      messages: [{ role: "user", content: message }],
      model: MODEL,
    };

    console.log('Sending request to OpenRouter API:', API_URL);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": `${process.env.NEXT_PUBLIC_APP_URL}`,
        "X-Title": "LLM Chat Interface",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(chatRequest)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    console.log('Response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}