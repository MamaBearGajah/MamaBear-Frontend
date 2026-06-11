"use client";

import { useEffect, useState } from "react";

import { createBlog } from "@/lib/api/blog";
import { User, BlogCreateListParams } from "@/types";
import { apiClient } from "@/lib/api/client";

export default function CreateBlogForm() {
  const [users, setUsers] = useState<User[]>([]);

  const [form, setForm] = useState<BlogCreateListParams>({
    title: "",
    authorId: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    status: "draft",
  });

  

  // ================= FETCH USERS (AUTHORS) =================
//   const fetchUsers = async () => {
//     try {
//       const { data } = await apiClient.get("/users");
//       setUsers(data.data);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     }
//   };

const MOCK_BLOGS: BlogList[] = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    slug: "getting-started-nextjs",
    excerpt: "Learn the basics of Next.js in this guide.",
    content: "Full content here...",
    coverImage: "https://via.placeholder.com/300",
    status: "published",
    authorId: "1",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Understanding React State",
    slug: "react-state-guide",
    excerpt: "Deep dive into useState and state management.",
    content: "Full content here...",
    coverImage: "https://via.placeholder.com/300",
    status: "draft",
    authorId: "2",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    title: "Tailwind CSS Tips",
    slug: "tailwind-tips",
    excerpt: "Improve your UI faster with Tailwind tricks.",
    content: "Full content here...",
    coverImage: "https://via.placeholder.com/300",
    status: "published",
    authorId: "3",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

const fetchUsers = async () => {
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    isVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Alex Tan",
    email: "alex@example.com",
    role: "admin",
    isVerified: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

  setUsers(MOCK_USERS);
};



  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= CREATE BLOG =================
  const handleSubmit = async () => {
    try {
      await createBlog(form);

      alert("Blog created!");

      setForm({
        title: "",
        authorId: "",
        slug: "",
        content: "",
        excerpt: "",
        coverImage: "",
        status: "draft",
      });
    } catch (err) {
      console.error("Create blog failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Blog</h1>

      {/* TITLE */}
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* SLUG */}
      <input
        placeholder="Slug"
        value={form.slug}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
      />

      {/* AUTHOR DROPDOWN */}
      <select
        value={form.authorId}
        onChange={(e) =>
          setForm({ ...form, authorId: e.target.value })
        }
      >
        <option value="">Select Author</option>

        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>

      {/* EXCERPT */}
      <textarea
        placeholder="Excerpt"
        value={form.excerpt}
        onChange={(e) =>
          setForm({ ...form, excerpt: e.target.value })
        }
      />

      {/* CONTENT */}
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) =>
          setForm({ ...form, content: e.target.value })
        }
      />

      {/* COVER IMAGE */}
      <input
        placeholder="Cover Image"
        value={form.coverImage}
        onChange={(e) =>
          setForm({ ...form, coverImage: e.target.value })
        }
      />

      {/* STATUS */}
      <select
        value={form.status}
        onChange={(e) =>
          setForm({
            ...form,
            status: e.target.value as any,
          })
        }
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* SUBMIT */}
      <button onClick={handleSubmit}>
        Create Blog
      </button>
    </div>
  );
}