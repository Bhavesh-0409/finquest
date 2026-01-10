"use client";

import { useState, useEffect } from "react";
import { NewsArticle, fetchFinanceNews, formatDate, getMockFinanceNews } from "@/lib/newsApi";

type FinanceNewsListProps = {
  limit?: number;
  showHeader?: boolean;
};

export default function FinanceNewsList({
  limit = 10,
  showHeader = true,
}: FinanceNewsListProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  const loadNews = async (isRefresh: boolean = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const news = await fetchFinanceNews(limit);
      setArticles(news);
      setUsingMockData(false);
    } catch (err: any) {
      console.warn("Failed to fetch news from API, using mock data:", err);
      // Fallback to mock data
      const mockNews = getMockFinanceNews().slice(0, limit);
      setArticles(mockNews);
      setUsingMockData(true);
      
      // Only show error if it's not about missing API key (which we handle gracefully)
      if (!err.message?.includes("API key not configured")) {
        setError("Unable to load latest news. Showing sample articles.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [limit]);

  const handleRefresh = () => {
    loadNews(true);
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-5 md:p-6">
        {showHeader && (
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            Finance News
          </h2>
        )}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/5 rounded w-full mb-1"></div>
              <div className="h-4 bg-white/5 rounded w-5/6 mb-3"></div>
              <div className="h-3 bg-white/5 rounded w-1/4"></div>
              {i < 4 && <div className="mt-4 pt-4 border-t border-white/5" />}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !usingMockData) {
    return (
      <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-5 md:p-6">
        {showHeader && (
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            Finance News
          </h2>
        )}
        <div className="text-center py-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur border border-white/10 rounded-xl p-5 md:p-6 space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Finance News
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 px-3 py-1.5 rounded-lg hover:bg-white/10"
            title="Refresh news"
          >
            {isRefreshing ? "⟳ Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      )}

      {usingMockData && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
          <p className="font-semibold mb-1">⚠️ API Key Not Configured</p>
          <p className="text-xs text-blue-200/80">
            To see real-time finance news, add your NewsAPI key to{" "}
            <code className="bg-black/30 px-1 rounded">.env.local</code> as{" "}
            <code className="bg-black/30 px-1 rounded">
              NEXT_PUBLIC_NEWS_API_KEY
            </code>
            . Get a free key at{" "}
            <a
              href="https://newsapi.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-200"
            >
              newsapi.org
            </a>
            . Currently showing sample articles.
          </p>
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No news articles found.</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article, index) => (
            <article
              key={index}
              className="group hover:bg-white/5 transition-colors rounded-lg p-4 -m-4 md:p-4 md:m-0"
            >
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-semibold text-white leading-tight group-hover:text-yellow-400 transition-colors">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {article.title}
                  </a>
                </h3>

                {article.description && (
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed line-clamp-2">
                    {article.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-300">
                      {article.source}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                  >
                    Read more
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>

              {index < articles.length - 1 && (
                <div className="mt-6 pt-6 border-t border-white/10" />
              )}
            </article>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          Stay informed about the latest financial trends and market updates.
          {usingMockData && " Configure API key for real-time news."}
        </p>
      </div>
    </div>
  );
}
