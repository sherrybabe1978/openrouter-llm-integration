'use client';

import React, { useState } from 'react';
import Image from "next/image";

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'system', content: 'Sorry, there was an error processing your request.' }]);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen p-8 bg-white text-black">
      <header className="mb-8">
        <Image
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold mt-4 text-black">AI Chat Interface</h1>
      </header>

      <main className="flex-grow flex flex-col">
        <div className="flex-grow mb-4 overflow-y-auto border border-gray-300 p-4 rounded bg-white">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${
                msg.role === 'user' 
                  ? 'bg-blue-100 text-black' 
                  : 'bg-gray-100 text-black'
              }`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l text-black"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">Send</button>
        </form>
      </main>

      <footer className="mt-8 text-center text-sm text-black">
        Powered by Next.js and OpenRouter AI
      </footer>
    </div>
  );
}