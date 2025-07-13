// Types for GraphQL responses
export interface Country {
  code: string;
  name: string;
  capital?: string;
  currency?: string;
  emoji: string;
  languages?: Language[];
}

export interface Language {
  code: string;
  name: string;
}

export interface GetCountriesQuery {
  countries: Country[];
}

export interface GetCountryQuery {
  country: Country;
}

export interface GetCountryVariables {
  code: string;
}
