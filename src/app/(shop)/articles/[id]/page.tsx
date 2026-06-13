"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";

import { getBlogById } from "@/lib/api/blog";
import { BlogList } from "@/types";
import { mockBlogs } from "@/lib/blog/articlesData";

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [blog, setBlog] = useState<BlogList | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const result = await getBlogById(id);
        console.log("Result:", result);

        if (
          result &&
          typeof result === "object" &&
          result.id
        ) {
          setBlog(result);
        } else {
          const mockBlog = mockBlogs.find((blog) => blog.id === id);
          setBlog(mockBlog || null);
        }
      } catch (error) {
        console.error(error);

        const mockBlog = mockBlogs.find((blog) => blog.id === id);
        setBlog(mockBlog || null);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-80 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Blog Not Found
          </h1>

          <Link
            href="/blog"
            className="text-pink-600 hover:underline"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F8]">
      {/* Hero */}
      <div className="relative h-[500px]">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-5xl mx-auto px-6 pb-12">
            <Link
              href="/blog"
              className="inline-block mb-4 text-white"
            >
              ← Back to Articles
            </Link>

            <h1 className="text-5xl font-black text-white mb-4">
              {blog.title}
            </h1>

            <p className="text-lg text-white/90 max-w-3xl">
              {blog.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
            {blog.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>
            <h3 className="font-bold">
              {blog.author.name}
            </h3>

            <p className="text-gray-500 text-sm">
              {blog.author.email}
            </p>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            {new Date(blog.publishedAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <article
          className="prose prose-lg max-w-none bg-white rounded-2xl p-8 shadow-sm"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.content),
          }}
        />
      </div>
    </div>
  );
}