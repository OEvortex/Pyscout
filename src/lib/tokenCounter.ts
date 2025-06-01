/**
 * Token Counter Utility
 * Provides TikToken-like functionality for real-time token counting
 * This is a simplified token estimation based on common encoding patterns
 */

// Common token patterns for GPT-style models
const TOKEN_MULTIPLIER = 1.3; // Average tokens per word for English text
const CHAR_TO_TOKEN_RATIO = 4; // Rough estimate: 4 characters = 1 token

export interface TokenInfo {
  tokens: number;
  words: number;
  characters: number;
  charactersWithSpaces: number;
}

/**
 * Estimates token count using multiple heuristics
 * This provides a reasonable approximation similar to TikToken
 */
export function estimateTokenCount(text: string): TokenInfo {
  if (!text || text.trim().length === 0) {
    return {
      tokens: 0,
      words: 0,
      characters: 0,
      charactersWithSpaces: 0
    };
  }

  const trimmedText = text.trim();
  const charactersWithSpaces = text.length;
  const characters = trimmedText.replace(/\s/g, '').length;
  
  // Word count (split by whitespace and filter empty strings)
  const words = trimmedText.split(/\s+/).filter(word => word.length > 0).length;
  
  // Token estimation using multiple methods and taking the most conservative estimate
  const tokenEstimates = [
    // Method 1: Word-based estimation with multiplier
    Math.ceil(words * TOKEN_MULTIPLIER),
    
    // Method 2: Character-based estimation
    Math.ceil(charactersWithSpaces / CHAR_TO_TOKEN_RATIO),
    
    // Method 3: Advanced estimation considering punctuation and special chars
    estimateAdvancedTokens(trimmedText),
  ];

  // Use the highest estimate to be conservative (better to overestimate than underestimate)
  const tokens = Math.max(...tokenEstimates);

  return {
    tokens,
    words,
    characters,
    charactersWithSpaces
  };
}

/**
 * Advanced token estimation that considers:
 * - Punctuation and special characters
 * - Common subword patterns
 * - Code blocks and markdown
 */
function estimateAdvancedTokens(text: string): number {
  let tokens = 0;
  
  // Split into segments by common delimiters
  const segments = text.split(/(\s+|[.,;:!?()[\]{}"'`~@#$%^&*+=<>\/\\|-])/);
  
  for (const segment of segments) {
    if (segment.length === 0) continue;
    
    // Whitespace
    if (/^\s+$/.test(segment)) {
      continue; // Whitespace typically doesn't add tokens
    }
    
    // Single character punctuation
    if (segment.length === 1 && /[.,;:!?()[\]{}"'`~@#$%^&*+=<>\/\\|-]/.test(segment)) {
      tokens += 1;
      continue;
    }
    
    // Words and alphanumeric segments
    if (/\w/.test(segment)) {
      // Longer words might be split into multiple tokens
      if (segment.length <= 3) {
        tokens += 1;
      } else if (segment.length <= 6) {
        tokens += 1.5;
      } else if (segment.length <= 10) {
        tokens += 2;
      } else {
        // Very long words/strings get split more
        tokens += Math.ceil(segment.length / 4);
      }
    } else {
      // Special character sequences
      tokens += Math.ceil(segment.length / 2);
    }
  }
  
  return Math.ceil(tokens);
}

/**
 * Get color class for token count based on typical model limits
 */
export function getTokenCountColor(tokens: number): string {
  if (tokens < 1000) return 'text-green-500';
  if (tokens < 2000) return 'text-yellow-500';
  if (tokens < 3000) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) {
    return tokens.toString();
  }
  return `${(tokens / 1000).toFixed(1)}k`;
}

/**
 * Get a friendly description of the token count
 */
export function getTokenCountDescription(tokens: number): string {
  if (tokens === 0) return 'No tokens';
  if (tokens < 100) return 'Very short message';
  if (tokens < 500) return 'Short message';
  if (tokens < 1000) return 'Medium message';
  if (tokens < 2000) return 'Long message';
  if (tokens < 4000) return 'Very long message';
  return 'Extremely long message';
}
