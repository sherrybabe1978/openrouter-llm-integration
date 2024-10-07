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
      setMessages(prev => [...prev, { role: 'ai', content: data.choices[0].message.content }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'system', content: 'Sorry, there was an error processing your request.' }]);
    }

    setInput('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="mb-8">
        <Image
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold mt-4 text-white">AI Chat Interface</h1>
      </header>

      <main className="flex-grow container mx-auto p-6 flex flex-col">
        <div className="flex-grow mb-6 overflow-y-auto rounded-lg bg-black shadow-inner p-4 border border-white">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full mr-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 animate-gradient-xy"></div>
                </div>
              )}
              <span className={`inline-block p-3 rounded-lg max-w-[80%] bg-black border border-white
                shadow-md transition-all duration-300 ease-in-out hover:shadow-lg`}>
                {msg.content}
              </span>
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full ml-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 animate-gradient-xy"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-3 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 ease-in-out"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-3 rounded-r-lg hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 ease-in-out">
            Send
          </button>
        </form>
      </main>

      <footer className="mt-8 text-center text-sm text-white">
        Powered by Next.js and OpenRouter AI
      </footer>
    </div>
  );
}