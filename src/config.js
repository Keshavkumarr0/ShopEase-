export const config = {
  shopify: {
    domain: import.meta.env.VITE_SHOPIFY_DOMAIN,
    storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    apiVersion: '2024-01',
  },
  gemini: {
    apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY,
  },
  pagination: {
    productsPerPage: 12,
  },
};
