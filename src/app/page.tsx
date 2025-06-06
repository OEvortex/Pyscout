"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import type { Message, Model } from "@/types/chat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { InputBar } from "@/components/chat/InputBar";
import { ModelSelector } from "@/components/chat/ModelSelector";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  CircleUserRound,
  Bot,
  Image as ImageIcon,
  Brain,
  GalleryVerticalEnd,
  HelpCircle,
  LogOut,
  UserCog,
  History,
  Settings,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WebSearchService } from "@/lib/webSearch";

const DEFAULT_SYSTEM_PROMPT = `You are PyscoutAI, an advanced AI assistant with access to powerful tools and real-time information capabilities. You are designed to be helpful, accurate, and comprehensive in your responses.

## Core Personality & Approach:
- You are knowledgeable, professional, yet friendly and approachable
- You provide detailed, well-structured responses with clear explanations
- You think step-by-step through complex problems and show your reasoning
- You acknowledge uncertainty when you're not sure about something
- You are curious and ask clarifying questions when needed
- You adapt your communication style to match the user's needs and expertise level

## Web Search Integration:
When you receive search results (indicated by "SEARCH_QUERY:" followed by search content), you have access to current, real-time information obtained through AI-powered comprehensive research. Here's how to handle this:

### Comprehensive Search Result Analysis:
1. **Search Strategy Understanding** - Note the AI-generated search strategy and how multiple queries were designed to cover different aspects
2. **Multi-Query Results** - Analyze results from each specialized search query, understanding the specific rationale behind each
3. **Cross-Reference Information** - Compare findings across different search queries to identify consistent patterns and contradictions
4. **Source Diversity Assessment** - Evaluate the variety and credibility of sources across all search results
5. **Comprehensive Synthesis** - Combine insights from all search queries to provide the most complete picture possible

### Enhanced Response Structure with AI-Powered Search:
1. **Executive Summary** - Start with a clear, comprehensive answer that synthesizes all search findings
2. **Multi-Perspective Analysis** - Present information gathered from different search angles (current events, technical details, comparisons, etc.)
3. **Source Attribution by Query** - Reference which search strategy yielded which insights
4. **Credibility Assessment** - Note source reliability and cross-verification across multiple queries
5. **Currency and Coverage** - Highlight how the AI search strategy ensures current and comprehensive coverage

### AI Search Strategy Utilization:
- Acknowledge the sophisticated search approach when multiple specialized queries were used
- Explain how different search angles contributed to a more complete understanding
- Note when search strategies specifically targeted recent developments, technical details, or comparative analysis
- Highlight the comprehensiveness achieved through AI-generated query diversity

### Search Result Quality Assessment:
- Evaluate source credibility and reliability
- Note if sources conflict with each other
- Distinguish between factual reporting and opinion pieces
- Highlight when information needs verification or is from preliminary sources

## Communication Guidelines:

### Structure & Formatting:
- Use clear headings and bullet points for complex topics
- Break down complex information into digestible sections
- Use markdown formatting effectively for readability
- Provide numbered steps for processes or instructions

### Tone & Style:
- Professional but conversational
- Confident when information is well-supported
- Appropriately cautious when dealing with uncertain or developing information
- Encouraging and supportive when helping with learning or problem-solving

### Accuracy & Reliability:
- Always prioritize accuracy over speed
- Clearly distinguish between established facts and emerging information
- Acknowledge limitations in your knowledge, especially for very recent events
- Suggest additional research or expert consultation when appropriate

## Special Capabilities:

### Without Web Search:
- Provide comprehensive answers based on training data
- Clearly state when information might not be current
- Suggest that users might want to verify recent developments
- Offer to search for current information if web search becomes available

### With Web Search Active:
- Leverage real-time information to provide current, accurate responses
- Combine search results with your base knowledge for comprehensive answers
- Identify trends and patterns across multiple sources
- Provide context for current events and developments

## Example Response Patterns:

### When AI-Powered Web Search is Available:
"Based on comprehensive AI-generated search research, [executive summary]. 

The search strategy employed multiple specialized queries:
- [Query 1 type]: [findings and insights]
- [Query 2 type]: [findings and insights]  
- [Query 3 type]: [findings and insights]

Cross-referencing these sources reveals [synthesized insights]. According to [credible sources], [specific information with attribution].

**Key Findings:**
- [Finding 1 with source attribution]
- [Finding 2 with source attribution]
- [Finding 3 with source attribution]

**Current Status:** [Recent developments and timeline]

Sources consulted: [List diverse sources from multiple search angles]"

### When No Web Search:
"Based on my knowledge up to my last training update, [answer]. However, this is a rapidly evolving topic, so I'd recommend checking recent sources for the most current information. For the most up-to-date and comprehensive information, you might want to enable web search."

## Error Handling:
- If search results are incomplete or conflicting, acknowledge this limitation
- When search fails, clearly explain you're providing information based on your training data
- Always be transparent about the source and recency of your information

Remember: Your goal is to be the most helpful, accurate, and reliable AI assistant possible. Use all available tools and information to provide the best possible response to each user query.

Web search enhances your responses with current information while maintaining your core personality and helpfulness.`;
const CUSTOM_SYSTEM_PROMPT_KEY = "pyscoutai_custom_system_prompt";
const API_BASE_URL = "https://ai4free-test.hf.space/v1";

const WELCOME_MESSAGES = [
  "Hello, I'm PyscoutAI",
  "How can I help you today?",
  "Ask me anything!",
  "Ready for your questions!",
  "Let's explore some ideas.",
  "Greetings! What can I do for you?",
  "PyscoutAI at your service.",
  "What's on your mind?",
  "Let's create something amazing!",
  "Your friendly AI assistant is here.",
];

const WELCOME_MESSAGE_INTERVAL = 6000; // 6 seconds

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentModel, setCurrentModel] = useState<Model | null>(null);
  const [currentSystemPrompt, setCurrentSystemPrompt] = useState(
    DEFAULT_SYSTEM_PROMPT,
  );

  const [currentWelcomeMessage, setCurrentWelcomeMessage] = useState(
    WELCOME_MESSAGES[0],
  );
  const [clientMounted, setClientMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setClientMounted(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0 && !isLoading) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, isLoading]);

  useEffect(() => {
    const newChatParam = searchParams.get("newChat");
    if (newChatParam === "true") {
      setMessages([]);
      setIsLoading(false);
      setShowWelcome(true);
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        router.replace(currentPath, { scroll: false });
      }
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrompt = localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY);
      setCurrentSystemPrompt(storedPrompt || DEFAULT_SYSTEM_PROMPT);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    if (showWelcome && clientMounted) {
      const initialRandomIndex = Math.floor(
        Math.random() * WELCOME_MESSAGES.length,
      );
      setCurrentWelcomeMessage(WELCOME_MESSAGES[initialRandomIndex]);

      intervalId = setInterval(() => {
        setCurrentWelcomeMessage((prevMessage) => {
          let nextMessage;
          do {
            const newRandomIndex = Math.floor(
              Math.random() * WELCOME_MESSAGES.length,
            );
            nextMessage = WELCOME_MESSAGES[newRandomIndex];
          } while (nextMessage === prevMessage && WELCOME_MESSAGES.length > 1);
          return nextMessage;
        });
      }, WELCOME_MESSAGE_INTERVAL);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [showWelcome, clientMounted]);

  const handleModelChange = useCallback((model: Model | null) => {
    setCurrentModel(model);
  }, []);  const handleSendMessage = async (
    content: string,
    isSuggestionClick = false,
    toolsData?: string,
  ) => {
    if (!currentModel) {
      toast({
        title: "Model Not Selected",
        description:
          "Please select a model from the dropdown before sending a message.",
        variant: "destructive",
      });
      return;
    }

    setShowWelcome(false);
    
    // Parse tools data
    let activatedTools: string[] = [];
    if (toolsData) {
      try {
        const parsed = JSON.parse(toolsData);
        activatedTools = parsed.tools || [];
      } catch (error) {
        console.error("Error parsing tools data:", error);
      }
    }
    
    // Process message content based on active tools
    let processedContent = content;    // Check if web search is enabled
    if (activatedTools.includes("web_search")) {
      try {
        // Check if current model supports tools
        if (currentModel.id === 'AI4Chat/default') {
          toast({
            title: "Web Search Not Available",
            description: "Web search functionality doesn't work with the AI4Chat/default model. Please select a different model to use web search.",
            variant: "destructive",
          });
          // Don't perform web search, continue with regular message processing
        } else {
          // Initialize web search service with current model
          const webSearchService = new WebSearchService(currentModel.id);
          
          // Show loading toast for web search
          toast({
            title: "Generating search strategy...",
            description: "AI is creating sophisticated search queries for comprehensive research.",
          });
            
          // Perform comprehensive AI-powered web search
          const comprehensiveResults = await webSearchService.comprehensiveSearch(content, 3);
        
        if (comprehensiveResults.searchResults && comprehensiveResults.searchResults.length > 0) {
          // Update toast to show search execution
          toast({
            title: "Executing search queries...",
            description: `Running ${comprehensiveResults.queryPlan.queries.length} AI-generated queries.`,
          });

          // Format comprehensive search results for the AI
          let formattedResults = `SEARCH_QUERY: ${content}\n\n`;
          formattedResults += `Search Strategy: ${comprehensiveResults.queryPlan.rationale}\n\n`;
          
          // Add query plan
          formattedResults += `Search Queries Generated:\n`;
          comprehensiveResults.queryPlan.queries.forEach((query, index) => {
            formattedResults += `${index + 1}. "${query.query}" - ${query.rationale}\n`;
          });
          formattedResults += '\n';

          // Add results from each query
          comprehensiveResults.searchResults.forEach((searchResult, queryIndex) => {
            if (searchResult.results.results.length > 0) {
              formattedResults += `Results for Query ${queryIndex + 1}: "${searchResult.query.query}"\n`;
              
              searchResult.results.results.slice(0, 3).forEach((result, resultIndex) => {
                formattedResults += `${queryIndex + 1}.${resultIndex + 1}. ${result.title}\n`;
                formattedResults += `     ${result.description || 'No description available'}\n`;
                formattedResults += `     Source: ${result.url}\n\n`;
              });
            }
          });

          // Add summary
          formattedResults += `\nResearch Summary:\n`;
          formattedResults += `- Total Results: ${comprehensiveResults.summary.totalResults}\n`;
          formattedResults += `- Unique Sources: ${comprehensiveResults.summary.totalSources}\n`;
          formattedResults += `- Queries Executed: ${comprehensiveResults.queryPlan.queries.length}\n\n`;
          
          formattedResults += `Please analyze these comprehensive search results and provide a detailed, well-sourced answer to: "${content}"`;

          processedContent = formattedResults;          toast({
            title: "Research completed",
            description: `Found ${comprehensiveResults.summary.totalResults} results from ${comprehensiveResults.summary.totalSources} sources using AI-generated queries.`,
            variant: "success",
          });
        } else {
          toast({
            title: "No results found",
            description: "Comprehensive search yielded no results. Proceeding with general knowledge.",
            variant: "warning",
          });
          processedContent = `SEARCH_QUERY: ${content}

No current web search results were found for this query despite using multiple AI-generated search strategies. Please provide an answer based on your general knowledge and indicate that this information may not be the most current available.`;
        }
        } // Close the else block for non-default model
      } catch (error) {
        console.error("Comprehensive web search error:", error);
        toast({
          title: "Search failed",
          description: "AI-powered web search encountered an error. Using general knowledge instead.",
          variant: "destructive",
        });
        processedContent = `SEARCH_QUERY: ${content}

Web search failed due to a technical error. Please provide an answer based on your general knowledge and indicate that this information may not be the most current available.`;
      }
    }

    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    let activeSystemPrompt = DEFAULT_SYSTEM_PROMPT;
    if (typeof window !== "undefined") {
      activeSystemPrompt =
        localStorage.getItem(CUSTOM_SYSTEM_PROMPT_KEY) || DEFAULT_SYSTEM_PROMPT;
    }
    setCurrentSystemPrompt(activeSystemPrompt);    const messagesForApi = [
      { role: "system", content: activeSystemPrompt },
      ...messages
        .filter((m) => m.id !== "initial-bot-message-for-stream")
        .map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: processedContent }, // Use processed content instead of original
    ].filter((msg) => msg.content.trim() !== "");

    const botMessageId = crypto.randomUUID();
    const initialBotMessageTimestamp = new Date();

    const initialBotMessage: Message = {
      id: botMessageId,
      role: "assistant",
      content: "",
      timestamp: initialBotMessageTimestamp,
    };
    setMessages((prevMessages) => [...prevMessages, initialBotMessage]);

    let accumulatedResponse = "";

    try {
      const useStreaming = true; // Always true as per previous request

      const response = await fetch(`${API_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          model: currentModel.id,
          messages: messagesForApi,
          temperature: 0.7,
          max_tokens: 250,
          stream: useStreaming,
        }),
      });

      if (!response.ok) {
        let apiErrorMessage = `API Error: ${response.status}`;
        try {
          const errorData = await response.json();
          const messageFromServer =
            errorData.error?.message ||
            errorData.detail ||
            (errorData.error && typeof errorData.error === "object"
              ? JSON.stringify(errorData.error)
              : errorData.error) ||
            errorData.message;

          if (typeof messageFromServer === "string") {
            apiErrorMessage = messageFromServer;
          } else if (
            messageFromServer &&
            typeof messageFromServer === "object"
          ) {
            apiErrorMessage = JSON.stringify(messageFromServer);
          } else if (typeof errorData === "string") {
            apiErrorMessage = errorData;
          }
        } catch (e) {
          try {
            const errorText = await response.text();
            if (errorText) apiErrorMessage = errorText;
          } catch (textErr) {
            // Stick with original HTTP error if text parsing also fails
          }
        }
        throw new Error(apiErrorMessage);
      }

      if (!response.body) {
        throw new Error("Response body is null for streaming");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamLoop = true;

      while (streamLoop) {
        const { done, value } = await reader.read();
        if (done) {
          streamLoop = false;
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const eventLines = chunk.split("\n\n");

        for (const eventLine of eventLines) {
          if (eventLine.trim() === "") continue;
          if (eventLine.startsWith("data: ")) {
            const jsonDataString = eventLine.substring(5).trim();
            if (jsonDataString === "[DONE]") {
              streamLoop = false;
              break;
            }
            if (jsonDataString) {
              try {
                const parsed = JSON.parse(jsonDataString);
                const choice = parsed.choices?.[0];
                if (choice) {
                  const deltaContent =
                    typeof choice.delta?.content === "string"
                      ? choice.delta.content
                      : "";
                  if (deltaContent) {
                    accumulatedResponse += deltaContent;
                    setMessages((prevMessages) =>
                      prevMessages.map((msg) =>
                        msg.id === botMessageId
                          ? {
                              ...msg,
                              content: accumulatedResponse,
                              timestamp: initialBotMessageTimestamp,
                            }
                          : msg,
                      ),
                    );
                  }
                  if (choice.finish_reason) {
                    streamLoop = false;
                    break;
                  }
                }
              } catch (e) {
                console.error("Error parsing stream data:", e, jsonDataString);
              }
            }
          }
          if (!streamLoop) break;
        }
      }
    } catch (error) {
      console.error("Failed to send message or process response:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error",
        description: `Assistant communication failed: ${errorMessage}`,
        variant: "destructive",
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                content: `Sorry, I couldn't process your request. ${errorMessage}`,
                timestamp: initialBotMessageTimestamp,
              }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
      if (isSuggestionClick && textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleProfileMenuClick = (action: string) => {
    switch (action) {
      case "Manage Account":
        router.push("/account");
        break;
      case "Activity":
        router.push("/activity");
        break;
      case "Settings":
        router.push("/settings");
        break;
      case "Help & Feedback":
        router.push("/help");
        break;
      case "Sign Out":
        toast({
          title: "Signed Out",
          description: "You have been signed out (placeholder).",
        });
        router.push("/");
        break;
      default:
        toast({
          title: "Profile Action",
          description: `${action} clicked (placeholder).`,
        });
    }
  };
  return (
    <main
      className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/30"
      data-oid="941ef_n"
    >
      {/* Modern floating header with glassmorphism effect */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-4 z-10 h-[72px] relative"
        data-oid="3ko4dqa"
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
          data-oid="nm9r4n6"
        />

        <div
          className="flex items-center gap-3 relative z-10"
          data-oid="xmmpz8t"
        >
          <div className="flex items-center gap-2" data-oid="hppj2yg">
            <div className="relative" data-oid="g2ln6sy">
              <Bot className="h-8 w-8 text-primary" data-oid="pxb2:zi" />
              <div
                className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"
                data-oid="0nk8lbq"
              />
            </div>
            <span
              className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
              data-oid="-k:emjf"
            >
              PyscoutAI
            </span>
          </div>
          <div
            className="hidden sm:block h-6 w-px bg-border/60"
            data-oid="bt9twn4"
          />

          <ModelSelector
            selectedModelFromParent={currentModel}
            onModelChange={handleModelChange}
            data-oid=":8qm9.y"
          />
        </div>

        <div
          className="flex items-center space-x-3 relative z-10"
          data-oid="6wi0d2z"
        >
          <Button
            variant="outline"
            size="sm"
            className="text-sm font-medium bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20 hover:bg-gradient-to-r hover:from-primary/20 hover:to-purple-500/20 hover:border-primary/40 transition-all duration-300 shadow-sm"
            onClick={() => router.push("/pricing")}
            data-oid="0_4ni9:"
          >
            <Sparkles
              className="mr-2 h-4 w-4 text-primary"
              data-oid="ar6:g-8"
            />
            Upgrade
          </Button>

          <DropdownMenu data-oid="59axlrh">
            <DropdownMenuTrigger asChild data-oid="5cs7_l_">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm"
                data-oid="ii9cuey"
              >
                <CircleUserRound
                  className="h-5 w-5 text-primary"
                  data-oid="j9c9:4u"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mr-2 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl"
              align="end"
              data-oid="scwfo16"
            >
              <DropdownMenuLabel
                className="text-primary font-medium"
                data-oid="u79.5k0"
              >
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator
                className="bg-border/50"
                data-oid="vhjc5b9"
              />

              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Manage Account")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="ifcxb3e"
              >
                <UserCog
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="l4iujos"
                />

                <span data-oid="g4ws8wm">Manage Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Activity")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="x6wo6c3"
              >
                <History
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="tv30wwy"
                />

                <span data-oid="g07f0w3">Activity</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Settings")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="ho0__w:"
              >
                <Settings
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="pmoyd58"
                />

                <span data-oid="pb_db8y">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator
                className="bg-border/50"
                data-oid=".q8pcvu"
              />

              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Help & Feedback")}
                className="hover:bg-primary/10 transition-colors"
                data-oid="a35nu-t"
              >
                <HelpCircle
                  className="mr-2 h-4 w-4 text-primary/80"
                  data-oid="e4i_hxs"
                />

                <span data-oid="h53l.a2">Help & Feedback</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleProfileMenuClick("Sign Out")}
                className="hover:bg-destructive/10 text-destructive transition-colors"
                data-oid="15wg.9d"
              >
                <LogOut className="mr-2 h-4 w-4" data-oid="lbune56" />
                <span data-oid="w99y437">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content area with enhanced welcome screen */}
      <div className="flex-1 flex flex-col min-h-0 relative" data-oid="70g0vwi">
        {showWelcome && messages.length === 0 && !isLoading && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6 z-0"
            data-oid="_6gk01k"
          >
            <div
              className="text-center mb-12 max-w-2xl mx-auto"
              data-oid="9z5ofll"
            >
              {/* Welcome message with enhanced typography */}
              <h2
                key={
                  clientMounted && showWelcome
                    ? currentWelcomeMessage
                    : WELCOME_MESSAGES[0]
                }
                className="text-4xl sm:text-6xl font-bold bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out mb-4"
                data-oid="hsp5ul9"
              >
                {clientMounted && showWelcome
                  ? currentWelcomeMessage
                  : WELCOME_MESSAGES[0]}
              </h2>

              {/* Subtitle */}
              <p
                className="text-lg text-muted-foreground/80 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 delay-200 ease-out"
                data-oid="v8fgy2q"
              >
                Your advanced AI assistant for any task
              </p>

              {/* Feature highlights */}
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-xl mx-auto"
                data-oid="2:_haju"
              >
                {[
                  { icon: Brain, text: "Smart Analysis" },
                  { icon: ImageIcon, text: "Image Generation" },
                  { icon: GalleryVerticalEnd, text: "Creative Tools" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-1000 ease-out"
                    style={{ animationDelay: `${400 + index * 200}ms` }}
                    data-oid="1g6.9lk"
                  >
                    <feature.icon
                      className="h-6 w-6 text-primary/80 mb-2"
                      data-oid="t.aoz64"
                    />

                    <span
                      className="text-sm text-muted-foreground font-medium"
                      data-oid="-t5890g"
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          data-oid="5eufwdt"
        />
      </div>

      {/* Enhanced input bar */}
      <InputBar
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        textareaRef={textareaRef}
        data-oid="prluv9l"
      />
    </main>
  );
}
