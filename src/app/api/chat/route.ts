import { NextResponse } from 'next/server';
import type { Message } from '@/types/chat';

// This is a simplified version of the Message interface for API interaction
interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userMessages: ApiMessage[] = body.messages;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || "";
    let botResponseContent = "I'm a mock assistant for ChimpChat. I received: '" + lastUserMessage + "'. How can I help you further?";

    if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi") || lastUserMessage.includes("hey")) {
      botResponseContent = "Hello there! It's great to chat with you. What's on your mind?";
    } else if (lastUserMessage.includes("how are you")) {
      botResponseContent = "I'm doing splendidly, thanks for asking! Ready to assist with any questions you have.";
    } else if (lastUserMessage.includes("help")) {
        botResponseContent = "Of course! I'm here to help. What can I do for you today?";
    } else if (lastUserMessage.includes("tell me a joke")) {
        botResponseContent = "Why don't scientists trust atoms? Because they make up everything!";
    } else if (lastUserMessage.includes("what is your name")) {
        botResponseContent = "I'm ChimpChat, your friendly neighborhood chatbot!";
    } else if (lastUserMessage.length > 50) {
        botResponseContent = "That's an interesting point! Could you elaborate a bit more on that?";
    }


    const botResponse: { choices: { message: ApiMessage }[] } = {
      choices: [
        {
          message: {
            role: 'assistant',
            content: botResponseContent,
          },
        },
      ],
    };

    return NextResponse.json(botResponse);
  } catch (error) {
    console.error("Error in /api/chat:", error);
    let message = "Internal Server Error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
