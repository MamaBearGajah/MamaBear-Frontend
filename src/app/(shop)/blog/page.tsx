"use client"
import React, { useState, useMemo } from "react";
import Link from "next/link";
import BackToTop from "@/components/common/BackToTop";

import { Clock, BookOpen, ChevronRight, Search, ArrowRight } from "lucide-react";
import { getStoredArticles, ARTICLE_CATEGORIES, Article } from "@/lib/blog/articlesData";

const ALL_CATEGORY = "all";

export default function Page() {

  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");

  const articles = useMemo(() => getStoredArticles().filter((a) => a.isPublished), []);

  function ArticleCard({
  article,
  getCatMeta,
}: {
  article: Article;
  getCatMeta: (cat: string) => { color: string; bg: string; label?: string };
}) {
  const cat = getCatMeta(article.category);
  return (
    <Link href="#" className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border" style={{ borderColor: "#F0D9E2" }}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: cat.color }}
        >
          {article.categoryLabel}
        </div>
        {article.featured && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#D5557E" }}
          >
            ✦ Featured
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-2 group-hover:opacity-75 transition-opacity leading-snug" style={{ color: "#3B1F0E", fontSize: "1rem", fontWeight: 800 }}>
          {article.title}
        </h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-3" style={{ color: "#8B6352" }}>
          {article.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black shrink-0" style={{ backgroundColor: "#D5557E", fontSize: "10px" }}>
              {article.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <p className="text-xs font-bold truncate max-w-[100px]" style={{ color: "#6C4735" }}>
              {article.author.split(" ").slice(0, 2).join(" ")}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: "#8B6352" }}>
            <Clock size={11} />
            {article.readTime} min
          </div>
        </div>
      </div>
    </Link>
  );
}

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = activeCategory === ALL_CATEGORY || a.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  const featured = useMemo(() => articles.filter((a) => a.featured), [articles]);
  const topFeatured = featured[0];

  const getCatMeta = (cat: string) =>
    ARTICLE_CATEGORIES.find((c) => c.value === cat) ?? { color: "#D5557E", bg: "#FFF5F8", label: cat };
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5F8", fontFamily: "'Urbanist', sans-serif" }}>
      <BackToTop/>
      {/* Hero */}
      <div
        className="relative overflow-hidden py-16 px-6 sm:px-12 lg:px-20"
        style={{ background: "linear-gradient(135deg, #3B1F0E 0%, #6C4735 50%, #D5557E 100%)" }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #FACBD8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #FFF5F8 0%, transparent 50%)" }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#FACBD8" }}>
            <BookOpen size={13} />
            Mamabear Wellness Hub
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", fontWeight: 900, lineHeight: 1.2 }}>
            Tips & Articles for<br />
            <span style={{ color: "#FACBD8" }}>Breastfeeding Mamas</span>
          </h1>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7 }}>
            Evidence-based guidance from certified lactation consultants and nutrition experts, written with love for every mama's journey.
          </p>

          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#8B6352" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, tips, topics…"
              className="w-full pl-11 pr-5 py-3.5 rounded-full text-sm focus:outline-none shadow-lg"
              style={{ fontFamily: "'Urbanist', sans-serif", color: "#3B1F0E" }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(ALL_CATEGORY)}
            className="px-4 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              backgroundColor: activeCategory === ALL_CATEGORY ? "#D5557E" : "white",
              color: activeCategory === ALL_CATEGORY ? "white" : "#6C4735",
              border: `1.5px solid ${activeCategory === ALL_CATEGORY ? "#D5557E" : "#F0D9E2"}`,
            }}
          >
            All Articles
          </button>
          {ARTICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                backgroundColor: activeCategory === cat.value ? cat.color : "white",
                color: activeCategory === cat.value ? "white" : cat.color,
                border: `1.5px solid ${activeCategory === cat.value ? cat.color : cat.color + "40"}`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured article (only on "all" view without search) */}
        {activeCategory === ALL_CATEGORY && !searchQuery && topFeatured && (
          <div className="mb-10">
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#D5557E" }}>
              Featured Article
            </p>
            <Link href="#" className="group block">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-md bg-white">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img
                    src={topFeatured.image}
                    alt={topFeatured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: getCatMeta(topFeatured.category).color }}
                  >
                    {topFeatured.categoryLabel}
                  </div>
                </div>
                <div className="p-7 flex flex-col justify-center">
                  <h2 className="mb-3 group-hover:opacity-80 transition-opacity" style={{ color: "#3B1F0E", fontSize: "1.35rem", fontWeight: 800, lineHeight: 1.3 }}>
                    {topFeatured.title}
                  </h2>
                  <p className="mb-5 text-sm leading-relaxed" style={{ color: "#8B6352" }}>
                    {topFeatured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0" style={{ backgroundColor: "#D5557E" }}>
                        {topFeatured.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-xs font-black" style={{ color: "#3B1F0E" }}>{topFeatured.author}</p>
                        <p className="text-xs" style={{ color: "#8B6352" }}>{topFeatured.authorRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "#8B6352" }}>
                      <Clock size={12} />
                      {topFeatured.readTime} min read
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-bold" style={{ color: "#D5557E" }}>
                    Read Article <ArrowRight size={15} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} style={{ color: "#FACBD8" }} className="mx-auto mb-4" />
            <h3 className="mb-2" style={{ color: "#6C4735" }}>No articles found</h3>
            <p className="text-sm" style={{ color: "#8B6352" }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold mb-5" style={{ color: "#8B6352" }}>
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== ALL_CATEGORY && ` in ${getCatMeta(activeCategory).label}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <ArticleCard key={article.id} article={article} getCatMeta={getCatMeta} />
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <div
          className="mt-16 rounded-3xl p-8 sm:p-12 text-center overflow-hidden relative"
          style={{ background: "linear-gradient(135deg, #6C4735, #D5557E)" }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #FACBD8, transparent 60%)" }} />
          <div className="relative">
            <h2 className="text-white mb-3" style={{ fontWeight: 900, fontSize: "1.5rem" }}>
              Have questions about breastfeeding?
            </h2>
            <p className="mb-6 text-sm" style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
              Book a free consultation with our certified lactation consultants — we're here to support your journey.
            </p>
            <Link
              href="/consultation"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "white", color: "#D5557E" }}
            >
              Book Free Consultation <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
