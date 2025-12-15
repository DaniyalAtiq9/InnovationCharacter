import React from "react";
import NewsArticleSearch from "@/components/NewsArticleSearch";

const NewsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-center text-primary">Character in the News</h1>
      <p className="text-lg text-muted-foreground text-center">
        Discover inspiring stories of individuals demonstrating key virtues in the real world.
      </p>
      <NewsArticleSearch />
    </div>
  );
};

export default NewsPage;