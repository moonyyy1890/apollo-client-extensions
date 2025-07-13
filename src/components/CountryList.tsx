import { GET_COUNTRIES } from "../graphql/queries";
import type { GetCountriesQuery } from "../graphql/types";
import CountryCard from "./CountryCard";
import "./CountryList.css";
import { useEffect, useState } from "react";

import { useApolloClient, ApolloError } from "@apollo/client";

interface CountryListState {
  data: GetCountriesQuery | undefined;
  loading: boolean;
  extensions?: { noOfResults?: number };
  error?: ApolloError;
}

const CountryList = () => {
  // Using useApolloClient hook instead of prop
  const client = useApolloClient();

  const [result, setResult] = useState<CountryListState>({
    data: undefined,
    loading: true,
    extensions: undefined,
    error: undefined,
  });

  const { data, loading, extensions, error } = result;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // This will use your httpLink to call the real Countries API
        // MSW will intercept the response and add extensions
        const queryResult = await client.query({
          query: GET_COUNTRIES,
          fetchPolicy: "no-cache", // Forces network request, doesn't write to cache
        });

        console.log("📊 client.query result:", queryResult);
        console.log(
          "🔧 Extensions from queryResult.extensions:",
          (queryResult as any).extensions
        );
        console.log(
          "🔧 Extensions from queryResult.data.extensions:",
          (queryResult.data as any).extensions
        );

        // Try to get extensions from result.data.extensions (set by extensionsLink)
        const extensions = (queryResult.data as any).extensions;
        console.log("🎯 Final extensions to use:", extensions);

        setResult({
          data: queryResult.data,
          loading: false,
          extensions: extensions,
          error: queryResult.error,
        });
      } catch (err) {
        console.error("❌ Error fetching countries:", err);
        setResult({
          data: undefined,
          loading: false,
          extensions: undefined,
          error: err as ApolloError,
        });
      }
    };

    fetchCountries();
  }, [client]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading countries...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <h2>Error loading countries</h2>
        <p>{error.message}</p>
      </div>
    );

  console.log("data", data);

  return (
    <div className="country-list">
      <h2>
        Countries Around the World
        {extensions && ` (${extensions.noOfResults || "N/A"})`}
      </h2>

      <div className="countries-grid">
        {data?.countries.slice(0, 20).map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>
    </div>
  );
};

export default CountryList;
