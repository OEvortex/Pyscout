// Web search utility using the provided API
interface SearchResult {
  url?: string;
  title: string;
  description?: string;
  body?: string;
  href?: string;
  metadata?: any;
  source?: string;
  position?: number;
  type?: string;
  first_seen?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total_results?: number;
  search_time?: number;
  query: string;
}

interface SearchQuery {
  query: string;
  rationale: string;
}

interface SearchQueriesResponse {
  rationale: string;
  queries: SearchQuery[];
}

export class WebSearchService {
  private readonly baseUrl = 'https://ai4free-test.hf.space';
  private readonly model: string;

  constructor(model: string = 'AI4Chat/default') {
    this.model = model;
  }
  
  /**
   * Perform a web search using the provided API
   */
  async search(
    query: string,
    options: {
      engine?: 'google' | 'bing' | 'duckduckgo';
      maxResults?: number;
      region?: string;
      safesearch?: 'off' | 'moderate' | 'strict';
      type?: 'text' | 'images' | 'videos' | 'news';
    } = {}
  ): Promise<SearchResponse> {
    const {
      engine = 'google',
      maxResults = 10,
      region = 'all',
      safesearch = 'moderate',
      type = 'text'
    } = options;

    const searchParams = new URLSearchParams({
      q: query,
      engine,
      max_results: maxResults.toString(),
      region,
      safesearch,
      type
    });

    const url = `${this.baseUrl}/search?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different response formats from the API
      let results: SearchResult[] = [];
      
      if (Array.isArray(data)) {
        results = data;
      } else if (data.results && Array.isArray(data.results)) {
        results = data.results;
      } else if (data.organic && Array.isArray(data.organic)) {
        results = data.organic;
      }

      // Normalize the results to have consistent structure
      const normalizedResults = results.map((result: any) => ({
        title: result.title || 'No title',
        description: result.description || result.body || result.snippet || '',
        url: result.url || result.href || result.link || '',
        source: result.source || '',
        position: result.position || 0,
        type: result.type || 'organic',
        metadata: result.metadata || {}
      }));

      return {
        results: normalizedResults,
        total_results: data.total_results || normalizedResults.length,
        search_time: data.search_time || 0,
        query
      };
    } catch (error) {
      console.error('Web search error:', error);
      throw new Error(`Failed to perform web search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  /**
   * Generate sophisticated search queries using AI
   */
  async generateSearchQueries(topic: string, maxQueries: number = 3): Promise<SearchQueriesResponse> {
    try {
      const response = await this.generateQueriesWithAI(topic, maxQueries);
      return response;
    } catch (error) {
      console.warn('AI query generation failed, falling back to heuristic approach:', error);
      return this.generateQueriesHeuristic(topic, maxQueries);
    }
  }
  /**
   * AI-powered query generation using the same API as the chat system
   */
  private async generateQueriesWithAI(topic: string, maxQueries: number = 3): Promise<SearchQueriesResponse> {
    // Check if the model is the default model that doesn't support tools
    if (this.model === 'AI4Chat/default') {
      throw new Error('Web search is not available with the AI4Chat/default model. Please select a different model to use web search functionality.');
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const currentYear = new Date().getFullYear();
    
    const systemPrompt = `You are an expert web search query strategist. Your task is to generate multiple sophisticated search queries that will comprehensively research a given topic.

IMPORTANT: You must respond with ONLY a valid JSON object in this exact format:
{
  "rationale": "Brief explanation of the search strategy",
  "queries": [
    {
      "query": "search query text",
      "rationale": "why this query is important"
    }
  ]
}

Guidelines for generating queries:
1. Create ${maxQueries} diverse search queries that approach the topic from different angles
2. Include specific, targeted queries rather than broad ones
3. Consider current events if the topic might have recent developments (current date: ${currentDate})
4. Include fact-checking queries for controversial topics
5. Add technical/detailed queries for complex subjects
6. Consider comparative queries if multiple options exist
7. Include recent/current year queries for time-sensitive topics

Ensure queries are:
- Specific and actionable
- Likely to return high-quality results
- Complementary to each other
- Focused on different aspects of the topic

Respond ONLY with the JSON object, no additional text.`;

    const userPrompt = `Generate comprehensive search queries for: "${topic}"`;

    const response = await fetch('https://ws.typegpt.net/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`AI query generation failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI query generation');
    }    // Parse the JSON response with robust handling of escaped JSON
    let parsedResponse: SearchQueriesResponse;
    let jsonContent = content.trim();
    
    try {
      // First, try to detect if it's a string containing escaped JSON
      if (jsonContent.startsWith('"') && jsonContent.endsWith('"')) {
        // It's a JSON string, parse it to get the actual JSON
        jsonContent = JSON.parse(jsonContent);
      }
      
      // Now try to parse the actual JSON
      parsedResponse = JSON.parse(jsonContent);
    } catch (parseError) {
      try {
        // Handle manually escaped JSON strings (common AI response format)
        let unescapedContent = jsonContent;
        
        // Fix common escape patterns
        unescapedContent = unescapedContent.replace(/\\"/g, '"');
        unescapedContent = unescapedContent.replace(/\\n/g, '\n');
        unescapedContent = unescapedContent.replace(/\\\\/g, '\\');
        
        parsedResponse = JSON.parse(unescapedContent);
      } catch (unescapeError) {
        try {
          // Try to extract JSON from markdown code blocks
          const codeBlockMatch = jsonContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
          if (codeBlockMatch) {
            let jsonStr = codeBlockMatch[1];
            jsonStr = jsonStr.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
            parsedResponse = JSON.parse(jsonStr);
          } else {
            // Try to extract any JSON object from the response
            const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              let jsonStr = jsonMatch[0];
              jsonStr = jsonStr.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\');
              parsedResponse = JSON.parse(jsonStr);
            } else {
              throw new Error(`Failed to find valid JSON in response: ${jsonContent.substring(0, 200)}...`);
            }
          }
        } catch (extractError) {
          const parseErrorMsg = parseError instanceof Error ? parseError.message : 'Unknown parse error';
          const unescapeErrorMsg = unescapeError instanceof Error ? unescapeError.message : 'Unknown unescape error';
          const extractErrorMsg = extractError instanceof Error ? extractError.message : 'Unknown extract error';
          
          console.error('All JSON parsing attempts failed:', {
            originalContent: content.substring(0, 500),
            parseError: parseErrorMsg,
            unescapeError: unescapeErrorMsg,
            extractError: extractErrorMsg
          });
          throw new Error('Failed to parse AI-generated queries - invalid JSON format');
        }
      }
    }

    // Validate the response structure
    if (!parsedResponse.queries || !Array.isArray(parsedResponse.queries)) {
      throw new Error('Invalid query structure from AI');
    }

    // Ensure we have valid queries
    const validQueries = parsedResponse.queries
      .filter(q => q.query && q.rationale && typeof q.query === 'string' && typeof q.rationale === 'string')
      .slice(0, maxQueries);

    if (validQueries.length === 0) {
      throw new Error('No valid queries generated by AI');
    }

    return {
      rationale: parsedResponse.rationale || `Generated ${validQueries.length} AI-powered search queries for comprehensive research on "${topic}".`,
      queries: validQueries
    };
  }

  /**
   * Fallback heuristic query generation (original logic)
   */
  private generateQueriesHeuristic(topic: string, maxQueries: number = 3): SearchQueriesResponse {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const queries: SearchQuery[] = [];
    
    // Primary query - direct search
    queries.push({
      query: topic,
      rationale: "Direct search for the main topic to gather comprehensive information"
    });

    // If topic seems to need current information, add a recent query
    if (topic.toLowerCase().includes('latest') || 
        topic.toLowerCase().includes('recent') || 
        topic.toLowerCase().includes('current') ||
        topic.toLowerCase().includes('2024') ||
        topic.toLowerCase().includes('2025')) {
      queries.push({
        query: `${topic} ${currentDate.split('-')[0]}`,
        rationale: "Search for current year information to ensure up-to-date results"
      });
    }

    // If topic seems like a comparison or analysis, add a detailed query
    if (topic.toLowerCase().includes('vs') || 
        topic.toLowerCase().includes('versus') ||
        topic.toLowerCase().includes('compare') ||
        topic.toLowerCase().includes('difference')) {
      queries.push({
        query: `${topic} comparison analysis`,
        rationale: "Search for detailed comparison and analysis content"
      });
    }

    // If topic is about a how-to or tutorial
    if (topic.toLowerCase().includes('how to') || 
        topic.toLowerCase().includes('tutorial') ||
        topic.toLowerCase().includes('guide')) {
      queries.push({
        query: `${topic} step by step guide`,
        rationale: "Search for detailed instructional content and guides"
      });
    }

    // Add a "latest news" query for better current coverage
    if (queries.length < maxQueries) {
      queries.push({
        query: `${topic} latest news ${currentDate.split('-')[0]}`,
        rationale: "Search for recent news and developments"
      });
    }

    // Limit to maxQueries
    const limitedQueries = queries.slice(0, maxQueries);

    return {
      rationale: `Generated ${limitedQueries.length} search queries to comprehensively research the topic "${topic}". These queries target different aspects and ensure current, relevant information is gathered.`,
      queries: limitedQueries
    };
  }
  /**
   * Perform comprehensive research by running multiple AI-generated search queries
   */
  async comprehensiveSearch(topic: string, maxQueries: number = 3): Promise<{
    topic: string;
    queryPlan: SearchQueriesResponse;
    searchResults: Array<{
      query: SearchQuery;
      results: SearchResponse;
    }>;
    summary: {
      totalResults: number;
      totalSources: number;
      searchTime: number;
    };
  }> {
    const queryPlan = await this.generateSearchQueries(topic, maxQueries);
    const searchResults: Array<{ query: SearchQuery; results: SearchResponse }> = [];
    let totalResults = 0;
    let totalSearchTime = 0;

    // Execute all search queries
    for (const query of queryPlan.queries) {
      try {
        const results = await this.search(query.query);
        searchResults.push({ query, results });
        totalResults += results.results.length;
        totalSearchTime += results.search_time || 0;
      } catch (error) {
        console.error(`Failed to search for query: ${query.query}`, error);
        // Continue with other queries even if one fails
      }
    }

    // Count unique sources
    const uniqueSources = new Set();
    searchResults.forEach(sr => {
      sr.results.results.forEach(result => {
        if (result.url) uniqueSources.add(new URL(result.url).hostname);
      });
    });

    return {
      topic,
      queryPlan,
      searchResults,
      summary: {
        totalResults,
        totalSources: uniqueSources.size,
        searchTime: totalSearchTime
      }
    };
  }
}

// Export a singleton instance
export const webSearchService = new WebSearchService();

// Export types for use in other components
export type { SearchResult, SearchResponse, SearchQuery, SearchQueriesResponse };
