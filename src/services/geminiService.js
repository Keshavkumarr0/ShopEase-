import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Model configuration for better responses
const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 1024,
};

// Safety settings
const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE",
  },
];

export const geminiService = {
  /**
   * Get chat response from Gemini AI
   * @param {string} userMessage - User's message
   * @param {string} productContext - Optional product context
   * @returns {Promise<string>} AI response
   */
  async getChatResponse(userMessage, productContext = '') {
    try {
      if (!userMessage || userMessage.trim() === '') {
        return 'Please ask me a question!';
      }

      // ✅ Updated to working model (gemini-2.0-flash-exp)
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig,
        safetySettings,
      });

      const prompt = `You are a helpful e-commerce shopping assistant for ShopEase. 
      ${productContext ? `Here are our available products: ${productContext}` : ''}
      
      User question: ${userMessage}
      
      Provide a helpful, friendly response about products, shopping, or general assistance. 
      Keep responses concise (2-3 sentences) and helpful.
      If asked about products not in our catalog, politely inform the user.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      // Check if response is blocked
      if (!response || !response.text) {
        console.warn('Response blocked or empty');
        return 'I apologize, but I cannot respond to that. Please ask something else!';
      }

      const text = response.text();
      return text;
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      
      // Specific error messages
      if (error.message?.includes('API key')) {
        return 'Configuration error. Please check API settings.';
      }
      if (error.message?.includes('quota')) {
        return 'Service temporarily unavailable. Please try again later.';
      }
      
      return 'Sorry, I am having trouble responding right now. Please try again later.';
    }
  },

  /**
   * Get product recommendations based on user query
   * @param {Array} products - Array of product objects
   * @param {string} userQuery - User's search query
   * @returns {Promise<string|null>} Recommendations or null
   */
  async getProductRecommendations(products, userQuery) {
    try {
      if (!products || products.length === 0) {
        return 'No products available at the moment.';
      }

      if (!userQuery || userQuery.trim() === '') {
        return null;
      }

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 512, // Shorter for recommendations
        },
        safetySettings,
      });

      // Format product list with prices if available
      const productList = products
        .slice(0, 20) // Limit to first 20 products to avoid token limits
        .map(p => {
          const price = p.price || p.variants?.[0]?.price || 'Price not available';
          return `- ${p.title} (${price}): ${p.description || 'No description'}`;
        })
        .join('\n');

      const prompt = `You are a product recommendation expert for an e-commerce store.

Available products:
${productList}

Customer is looking for: "${userQuery}"

Task: Recommend the top 3 most relevant products. For each product:
1. State the product name
2. Explain why it matches their needs (1-2 sentences)
3. Mention key features or benefits

Format your response as a numbered list. Keep it concise and helpful.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (!response || !response.text) {
        return null;
      }

      return response.text();
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return null;
    }
  },

  /**
   * Get streaming chat response (for real-time typing effect)
   * @param {string} userMessage - User's message
   * @param {string} productContext - Optional product context
   * @param {Function} onChunk - Callback for each text chunk
   * @returns {Promise<string>} Complete response
   */
  async getChatResponseStream(userMessage, productContext = '', onChunk) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig,
        safetySettings,
      });

      const prompt = `You are a helpful e-commerce shopping assistant for ShopEase. 
      ${productContext ? `Here are our available products: ${productContext}` : ''}
      
      User question: ${userMessage}
      
      Provide a helpful, friendly response about products, shopping, or general assistance. 
      Keep responses concise and helpful.`;

      const result = await model.generateContentStream(prompt);
      
      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (onChunk) {
          onChunk(chunkText);
        }
      }

      return fullText;
    } catch (error) {
      console.error('Error getting streaming response:', error);
      const errorMsg = 'Sorry, I am having trouble responding right now.';
      if (onChunk) {
        onChunk(errorMsg);
      }
      return errorMsg;
    }
  },

  /**
   * Analyze user sentiment for better customer service
   * @param {string} message - User's message
   * @returns {Promise<'positive'|'neutral'|'negative'>}
   */
  async analyzeSentiment(message) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          ...generationConfig,
          maxOutputTokens: 50,
        },
      });

      const prompt = `Analyze the sentiment of this customer message and respond with only one word: "positive", "neutral", or "negative".
      
      Message: "${message}"
      
      Sentiment:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const sentiment = response.text().toLowerCase().trim();
      
      if (['positive', 'neutral', 'negative'].includes(sentiment)) {
        return sentiment;
      }
      return 'neutral';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  },
};
