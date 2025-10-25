import axios from 'axios';
import { config } from '../config';

const shopifyClient = axios.create({
  baseURL: `https://${config.shopify.domain}/api/${config.shopify.apiVersion}/graphql.json`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': config.shopify.storefrontAccessToken,
  },
});

export const shopifyService = {
  async fetchProducts(limit = 12, cursor = null) {
    const query = `
      query getProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    try {
      const response = await shopifyClient.post('', {
        query,
        variables: { first: limit, after: cursor },
      });

      if (response.data.errors) {
        console.error('GraphQL Errors:', response.data.errors);
        throw new Error(response.data.errors[0].message);
      }

      const productsData = response.data.data.products;
      const products = productsData.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description,
        handle: edge.node.handle,
        price: edge.node.priceRange.minVariantPrice.amount,
        currency: edge.node.priceRange.minVariantPrice.currencyCode,
        image: edge.node.images.edges[0]?.node.url || '',
        imageAlt: edge.node.images.edges[0]?.node.altText || edge.node.title,
        variantId: edge.node.variants.edges[0]?.node.id || '',
        availableForSale: edge.node.variants.edges[0]?.node.availableForSale || false,
      }));

      return {
        products,
        pageInfo: productsData.pageInfo,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createCheckout(lineItems = []) {
    const mutation = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            message
            field
          }
        }
      }
    `;

    try {
      const response = await shopifyClient.post('', {
        query: mutation,
        variables: {
          input: { lineItems },
        },
      });

      if (response.data.data.checkoutCreate.checkoutUserErrors.length > 0) {
        throw new Error(response.data.data.checkoutCreate.checkoutUserErrors[0].message);
      }

      return response.data.data.checkoutCreate.checkout;
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  },

  async addToCheckout(checkoutId, lineItems) {
    const mutation = `
      mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkout {
            id
            webUrl
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            message
            field
          }
        }
      }
    `;

    try {
      const response = await shopifyClient.post('', {
        query: mutation,
        variables: { checkoutId, lineItems },
      });

      if (response.data.data.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
        throw new Error(response.data.data.checkoutLineItemsAdd.checkoutUserErrors[0].message);
      }

      return response.data.data.checkoutLineItemsAdd.checkout;
    } catch (error) {
      console.error('Error adding to checkout:', error);
      throw error;
    }
  },

  async fetchCheckout(checkoutId) {
    const query = `
      query getCheckout($id: ID!) {
        node(id: $id) {
          ... on Checkout {
            id
            webUrl
            completedAt
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    `;

    try {
      const response = await shopifyClient.post('', {
        query,
        variables: { id: checkoutId },
      });

      return response.data.data.node;
    } catch (error) {
      console.error('Error fetching checkout:', error);
      throw error;
    }
  },
};
