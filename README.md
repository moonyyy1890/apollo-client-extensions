# Apollo Client + MSW Extensions Demo

A demonstration of how to use **Mock Service Worker (MSW)** with **Apollo Client** to intercept GraphQL responses and add custom `extensions` fields.

## 🎯 What This Demo Shows

This project demonstrates how to:
- ✅ Intercept real GraphQL API responses using MSW
- ✅ Add custom `extensions` field to GraphQL responses  
- ✅ Access extensions in Apollo Client components
- ✅ Use a custom Apollo Link to capture extensions
- ✅ Display extensions data in your React components

## 🏗️ Project Structure

```
apollo-client-test/
├── src/
│   ├── components/
│   │   ├── CountryList.tsx      # Main component showing extensions
│   │   └── CountryCard.tsx      # Individual country display
│   ├── graphql/
│   │   ├── queries.ts           # GraphQL queries
│   │   └── types.ts             # TypeScript types
│   ├── mocks/
│   │   ├── handlers.ts          # MSW handlers (adds extensions)
│   │   └── browser.ts           # MSW browser setup
│   └── main.tsx                 # Apollo Client + MSW setup
├── public/
│   └── mockServiceWorker.js     # Required MSW service worker
└── package.json
```

## 📋 Key Features

### 1. **Real API Integration**
- Calls the actual Countries GraphQL API (countries.trevorblades.com)
- Uses MSW to intercept responses without changing your code

### 2. **Extensions Enhancement**
- Adds `extensions: { noOfResults: number }` to every GraphQL response
- Shows the count of results in the UI header

### 3. **Apollo Link Integration**
- Custom `extensionsLink` captures extensions from responses
- Attaches extensions to `result.data.extensions` for easy access

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:5173`

## 📊 How It Works

### The Flow:
1. **Apollo Client** makes GraphQL request to countries.trevorblades.com
2. **MSW Service Worker** intercepts the request
3. **MSW Handler** forwards request to real API using `bypass()`
4. **MSW Handler** adds `extensions` field to the response
5. **Apollo extensionsLink** captures extensions and attaches to `result.data.extensions`
6. **React Component** displays the extensions data

### Code Examples:

#### MSW Handler (`src/mocks/handlers.ts`)
```typescript
export const handlers = [
  graphql.operation(async ({ request, operationName }) => {
    // Forward to real API
    const response = await fetch(bypass(request));
    const originalData = await response.json();
    
    // Add extensions
    const enhancedResponse = {
      ...originalData,
      extensions: {
        noOfResults: originalData.data?.countries?.length || 0
      }
    };
    
    return HttpResponse.json(enhancedResponse);
  }),
];
```

#### Apollo Client Setup (`src/main.tsx`)
```typescript
// Custom Apollo Link to capture extensions
export const extensionsLink = new ApolloLink((operation, forward) => {
  return new Observable(observer => {
    if (forward) {
      forward(operation).subscribe({
        next: (result: FetchResult) => {
          // Attach extensions to result.data for easy access
          if (result.extensions && result.data) {
            (result.data as any).extensions = result.extensions;
          }
          observer.next(result);
        },
        // ...error and complete handlers
      });
    }
  });
});

// Apollo Client with link chain
const client = new ApolloClient({
  link: from([extensionsLink, httpLink]),
  cache: new InMemoryCache(),
});
```

#### Component Usage (`src/components/CountryList.tsx`)
```typescript
const CountryList = () => {
  const client = useApolloClient();

  useEffect(() => {
    const fetchCountries = async () => {
      const queryResult = await client.query({
        query: GET_COUNTRIES,
        fetchPolicy: "no-cache",
      });

      // Access extensions attached by extensionsLink
      const extensions = queryResult.data.extensions;
      console.log("Extensions:", extensions); // { noOfResults: 250 }
    };

    fetchCountries();
  }, [client]);

  // ...render component
};
```

## 🔧 Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   React App     │───▶│ Apollo Client    │───▶│ extensionsLink      │
│ (CountryList)   │    │ (client.query)   │    │                     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
         ▲                                               │
         │                                               ▼
         │                                    ┌─────────────────────┐
         │                                    │     httpLink        │
         │                                    │                     │
         │                                    └─────────────────────┘
         │                                               │
         │                                               ▼
         │                                    ┌─────────────────────┐
         │                                    │   MSW Service       │
         │                                    │   Worker            │
         │                                    └─────────────────────┘
         │                                               │
         │                                               ▼
         │                                    ┌─────────────────────┐
         │                                    │  MSW Handlers       │
         │                                    │  (adds extensions)  │
         │                                    └─────────────────────┘
         │                                               │
         │                                               ▼
         │                                    ┌─────────────────────┐
         │                                    │  Real GraphQL API   │
         │                                    │ countries.trevor... │
         │                                    └─────────────────────┘
         │                                               │
         └───────────────── Response with extensions ────┘
```

## 🎯 Key Benefits

### Why This Pattern is Useful:

1. **Development Flexibility**: Mock/enhance API responses without changing backend
2. **Extensions Access**: Access GraphQL extensions field that Apollo Client normally hides
3. **Real API Testing**: Test with real data while adding custom metadata
4. **Zero Code Changes**: Works with existing Apollo Client setup
5. **Type Safety**: Full TypeScript support throughout

## 🛠️ Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development
- **Apollo Client** for GraphQL
- **Mock Service Worker (MSW)** for request interception
- **Countries GraphQL API** for real data

## 📝 Important Files

### Required Files (Don't Delete):
- `public/mockServiceWorker.js` - MSW service worker (auto-generated)
- `src/mocks/handlers.ts` - Defines what to intercept and modify
- `src/mocks/browser.ts` - MSW browser setup

### Key Configuration:
- MSW is enabled only in development (`import.meta.env.DEV`)
- Uses `bypass()` to forward requests to real API
- Extensions are automatically calculated from response data

## 🔍 What You'll See

When you run the app:
1. Open browser console to see MSW logs
2. Look for "Extensions Link" logs showing captured extensions
3. Check the UI header showing "Countries Around the World (250)" 
4. The number in parentheses comes from the extensions field!

## 📚 Learn More

- [Apollo Client Links](https://www.apollographql.com/docs/react/api/link/introduction/)
- [Mock Service Worker](https://mswjs.io/)
- [GraphQL Extensions Spec](https://spec.graphql.org/October2021/#sec-Response-Format)

## 🤝 Use Cases

This pattern is perfect for:
- **API Enhancement**: Adding metadata to existing APIs
- **Development Testing**: Testing with real data + custom extensions
- **Performance Monitoring**: Adding timing/metrics to GraphQL responses
- **Feature Flags**: Conditionally modifying API responses
- **A/B Testing**: Testing different response formats

---

**Ready to explore?** Run `npm run dev` and check your browser console! 🚀
