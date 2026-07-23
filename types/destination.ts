export type DestinationContinent =
    | "Africa"
    | "Antarctica"
    | "Asia"
    | "Europe"
    | "North America"
    | "Oceania"
    | "South America";

export type DestinationCategory =
    | "beach"
    | "mountain"
    | "cultural"
    | "historical"
    | "culinary"
    | "adventure"
    | "relaxation"
    | "urban"
    | "nature"
    | "nightlife"
    | "romantic"
    | "family-friendly"
    | "eco-tourism"
    | string;

export type BudgetLevel = "budget" | "moderate" | "luxury" | "ultra-luxury";

export type ActivityLevel = "relaxed" | "moderate" | "active" | "strenuous";

export type TravelerType =
    | "solo"
    | "couples"
    | "families"
    | "friends-group"
    | "backpackers"
    | "luxury-travelers";

export interface GeoCoordinates {
    latitude: number;
    longitude: number;
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

export interface WeatherInfo {
    tempCelsius: number;
    tempFahrenheit: number;
    condition: string;
    humidity?: number;
    bestMonths: string[];
}

export interface Attraction {
    id: string;
    name: string;
    description: string;
    category?: string;
    imageUrl?: string;
    rating?: number;
    recommendedDurationHours?: number;
    coordinates?: GeoCoordinates;
}

export interface DestinationLocation {
    city: string;
    country: string;
    region?: string;
}

export interface Destination {
    id: string;
    slug?: string;
    name?: string;
    title?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    region?: string;
    continent?: DestinationContinent;
    location?: DestinationLocation;
    description?: string;
    shortDescription?: string;
    coverImage?: string;
    images?: string[];
    image?: string;
    emoji?: string;
    categories?: DestinationCategory[];
    tags?: string[];
    coordinates?: GeoCoordinates;
    rating?: number;
    reviewCount?: number;
    weather?: WeatherInfo;
    budgetLevel?: BudgetLevel;
    averageDailyCostUSD?: number;
    avgBudgetPerDay?: number;
    currency?: Currency;
    languages?: string[];
    timeZone?: string;
    bestTimeToVisit?: string;
    highlights?: Attraction[];
    isFeatured?: boolean;
    isTrending?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type DestinationSummary = Pick<
    Destination,
    | "id"
    | "slug"
    | "name"
    | "title"
    | "city"
    | "country"
    | "location"
    | "coverImage"
    | "images"
    | "emoji"
    | "rating"
    | "categories"
    | "tags"
    | "budgetLevel"
    | "avgBudgetPerDay"
    | "weather"
    | "isFeatured"
    | "isTrending"
>;

export interface DestinationFilterParams {
    search?: string;
    continent?: DestinationContinent;
    categories?: DestinationCategory[];
    budgetLevel?: BudgetLevel[];
    minRating?: number;
    minDuration?: number;              // NEW
    maxDuration?: number;              // NEW
    activityLevel?: ActivityLevel[];   // NEW
    bestFor?: TravelerType[];          // NEW
    sortBy?: "popular" | "rating" | "name" | "cost_asc" | "cost_desc";
    page?: number;
    limit?: number;
}

export interface PaginatedDestinations {
    data: Destination[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
}
