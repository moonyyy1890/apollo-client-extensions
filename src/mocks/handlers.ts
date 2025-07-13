import { graphql, HttpResponse, bypass } from 'msw';

// Simple extensions data generator
const generateExtensions = (data: { countries?: unknown[] } | undefined) => ({
  noOfResults: data?.countries?.length || 0,
});

export const handlers = [
  // Intercept all GraphQL operations to countries.trevorblades.com
  graphql.operation(async ({ request, operationName }) => {
    console.log('MSW: Intercepting operation:', operationName);
    
    // Use bypass to forward the request to the real API without MSW intercepting it again
    const response = await fetch(bypass(request));
    const originalData = await response.json();

    console.log('MSW: Original response data:', originalData);
    
    // Add extensions to the response
    const enhancedResponse = {
      ...originalData,
      extensions: generateExtensions(originalData.data),
    };

    console.log('MSW: Returning enhanced response with extensions:', enhancedResponse.extensions);
    console.log('MSW: Full enhanced response:', enhancedResponse);
    return HttpResponse.json(enhancedResponse);
  }),
];
