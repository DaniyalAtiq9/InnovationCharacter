import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, NewsArticle } from "@/services/api";
import { getAllVirtues } from "@/utils/virtues";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const NewsArticleSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getNewsArticles(query);
      setArticles(data);
    } catch (err: any) {
      console.error("Failed to fetch news:", err);
      setError("Failed to load news articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNews();
  }, [fetchNews]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNews(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, fetchNews]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(searchTerm);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">Search Character-Driven News</CardTitle>
          <CardDescription className="text-muted-foreground">Find inspiring stories of individuals demonstrating key virtues.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by keyword or virtue (e.g., courage, resilience)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 py-2 text-base"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 text-center text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">Loading articles...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <CardHeader className="flex-grow">
                  <CardTitle className="text-xl font-semibold leading-tight">{article.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-2 line-clamp-3">{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-6 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.virtues.map((virtueId) => {
                      const virtue = getAllVirtues().find((v) => v.id === virtueId);
                      const label = virtue ? virtue.name : virtueId;
                      return (
                        <Badge key={virtueId} variant="secondary" className="text-xs px-2 py-1">
                          {label}
                        </Badge>
                      );
                    })}
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1"
                  >
                    Read More <span className="ml-1">&rarr;</span>
                  </a>
                </CardContent>
              </Card>
            ))
          ) : (
            !loading && <p className="col-span-full text-center text-muted-foreground text-lg py-8">No articles found matching your search criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsArticleSearch;