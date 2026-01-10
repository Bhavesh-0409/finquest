// News API utility functions
// Using NewsAPI.org - Get your free API key at https://newsapi.org/
// Free tier: 100 requests per day

export type NewsArticle = {
  title: string;
  description: string;
  source: string;
  publishedAt: string;
  url: string;
  urlToImage?: string;
};

export type NewsApiResponse = {
  articles: Array<{
    title: string;
    description: string | null;
    source: { name: string };
    publishedAt: string;
    url: string;
    urlToImage: string | null;
  }>;
  status: string;
  totalResults: number;
};

// Format date to readable string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  }
}

// Fetch finance news from NewsAPI
export async function fetchFinanceNews(
  limit: number = 10
): Promise<NewsArticle[]> {
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  if (!apiKey) {
    console.warn(
      "NEXT_PUBLIC_NEWS_API_KEY not found. Using fallback news data."
    );
    throw new Error(
      "News API key not configured. Please add NEXT_PUBLIC_NEWS_API_KEY to your .env.local file."
    );
  }

  try {
    // Query finance-related keywords
    const query = "finance OR banking OR economy OR stock market OR investing OR fintech OR cryptocurrency OR market OR economic";
    
    // NewsAPI free tier works with 'everything' endpoint
    // Note: Free tier only works on localhost, for production you'll need a paid plan
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
      query
    )}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `News API error: ${response.status}`
      );
    }

    const data: NewsApiResponse = await response.json();

    // Transform API response to our format
    const articles: NewsArticle[] = data.articles
      .filter((article) => article.title && article.url) // Filter out incomplete articles
      .map((article) => ({
        title: article.title,
        description: article.description || "",
        source: article.source.name,
        publishedAt: article.publishedAt,
        url: article.url,
        urlToImage: article.urlToImage || undefined,
      }))
      .slice(0, limit);

    return articles;
  } catch (error: any) {
    console.error("Error fetching finance news:", error);
    throw error;
  }
}

// Fallback mock news data (used when API is unavailable)
export function getMockFinanceNews(): NewsArticle[] {
  const now = new Date();
  const mockArticles: NewsArticle[] = [
    {
      title: "Federal Reserve keeps interest rates steady amid economic uncertainty",
      description:
        "Central bank maintains current policy stance as inflation concerns persist",
      source: "Financial Times",
      publishedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news1",
    },
    {
      title: "Stock market reaches new highs as tech sector surges",
      description:
        "Major indices hit record levels driven by strong earnings and AI optimism",
      source: "Wall Street Journal",
      publishedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news2",
    },
    {
      title: "Cryptocurrency regulations tighten in major economies",
      description:
        "New compliance requirements reshape digital asset markets globally",
      source: "Bloomberg",
      publishedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news3",
    },
    {
      title: "Housing market shows signs of cooling after record growth",
      description:
        "Price growth moderates as mortgage rates impact buyer demand",
      source: "Reuters",
      publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news4",
    },
    {
      title: "Global inflation rates decline for third consecutive month",
      description:
        "Central bank policies show effectiveness in curbing price pressures",
      source: "CNBC",
      publishedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news5",
    },
    {
      title: "Renewable energy investments hit record $1.8 trillion worldwide",
      description:
        "Clean energy transition accelerates with unprecedented capital flows",
      source: "Financial Times",
      publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news6",
    },
    {
      title: "Central banks explore digital currency implementations",
      description:
        "CBDC pilots expand as nations prepare for future monetary systems",
      source: "The Economist",
      publishedAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news7",
    },
    {
      title: "Consumer spending patterns shift toward sustainable products",
      description:
        "ESG considerations increasingly influence purchasing decisions",
      source: "Forbes",
      publishedAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      url: "https://example.com/news8",
    },
  ];

  return mockArticles;
}
