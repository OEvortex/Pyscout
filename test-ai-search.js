// Test script for AI-powered web search functionality
// This demonstrates the new AI query generation capabilities

const testAISearch = async () => {
  try {
    console.log('🤖 Testing AI-Powered Web Search...\n');
    
    // Simulate the AI query generation request
    const testTopic = "latest developments in artificial intelligence 2024";
    
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
1. Create 3 diverse search queries that approach the topic from different angles
2. Include specific, targeted queries rather than broad ones
3. Consider current events if the topic might have recent developments (current date: 2024-12-19)
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

    const userPrompt = `Generate comprehensive search queries for: "${testTopic}"`;
    
    console.log('📝 Test Query:', testTopic);
    console.log('🔄 Sending request to AI query generation API...\n');

    const response = await fetch('https://ws.typegpt.net/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        model: 'AI4Chat/default',
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
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from AI');
    }

    console.log('✅ Raw AI Response:');
    console.log(content);
    console.log('\n');    // Parse the response with robust JSON handling
    let parsedResponse;
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
          console.error('All JSON parsing attempts failed:', {
            originalContent: content.substring(0, 500),
            parseError: parseError.message,
            unescapeError: unescapeError.message,
            extractError: extractError.message
          });
          throw new Error('Failed to parse AI-generated queries - invalid JSON format');
        }
      }
    }

    console.log('🎯 Generated Search Strategy:');
    console.log('Rationale:', parsedResponse.rationale);
    console.log('\n📋 AI-Generated Queries:');
    
    parsedResponse.queries.forEach((query, index) => {
      console.log(`${index + 1}. "${query.query}"`);
      console.log(`   Rationale: ${query.rationale}\n`);
    });

    console.log('🚀 AI-Powered Search Implementation Complete!');
    console.log('\nThe web search feature now uses sophisticated AI-generated queries instead of simple heuristics.');
    console.log('This provides much more comprehensive and targeted research capabilities.');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
    console.log('\n📝 Note: This is a demo script. The actual implementation includes fallback logic.');
  }
};

// Run the test if this is being executed directly
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testAISearch();
} else {
  // Browser environment - just log instructions
  console.log('🌐 To test in browser: Open DevTools Console and run testAISearch()');
  window.testAISearch = testAISearch;
}
