"use client";

import { useEffect, useState } from "react";

import { createBlog } from "@/lib/api/blog";
import {getAllBlogs} from "@/lib/api/blog";
import { User, BlogCreateListParams, BlogList } from "@/types";
import { mockBlogs } from "@/lib/blog/articlesData";
import { apiClient } from "@/lib/api/client";
import { CalendarDays, Eye, Pencil, Trash2, User, User, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent
} from "@/components/ui/card"

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

  const [blog, setBlog] = useState<BlogList[]>([]);

useEffect(() => {
  async function fetchBlogs() {
    try {
      const fetchedBlogs = await getAllBlogs();

      if (
        !Array.isArray(fetchedBlogs) ||
        fetchedBlogs.length === 0
      ) {
        setBlog(mockBlogs);
      } else {
        setBlog(fetchedBlogs);
      }
    } catch (error) {
      console.error(error);

      setBlog(mockBlogs);
    }
  }

  fetchBlogs();
}, []);



console.log("blog", blog)


  

  // ================= FETCH USERS (AUTHORS) =================
//   const fetchUsers = async () => {
//     try {
//       const { data } = await apiClient.get("/users");
//       setUsers(data.data);
//     } catch (err) {
//       console.error("Failed to fetch users:", err);
//     }
//   };

// const MOCK_BLOGS: BlogList[] = [
//   {
//     id: "1",
//     title: "Getting Started with Next.js",
//     slug: "getting-started-nextjs",
//     excerpt: "Learn the basics of Next.js in this guide.",
//     content: "Full content here...",
//     coverImage: "https://via.placeholder.com/300",
//     status: "published",
//     authorId: "1",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
//   {
//     id: "2",
//     title: "Understanding React State",
//     slug: "react-state-guide",
//     excerpt: "Deep dive into useState and state management.",
//     content: "Full content here...",
//     coverImage: "https://via.placeholder.com/300",
//     status: "draft",
//     authorId: "2",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
//   {
//     id: "3",
//     title: "Tailwind CSS Tips",
//     slug: "tailwind-tips",
//     excerpt: "Improve your UI faster with Tailwind tricks.",
//     content: "Full content here...",
//     coverImage: "https://via.placeholder.com/300",
//     status: "published",
//     authorId: "3",
//     createdAt: "2026-01-01T00:00:00.000Z",
//     updatedAt: "2026-01-01T00:00:00.000Z",
//   },
// ];

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
        {blog && blog.length > 0 ? (
    blog.map((item) => (
      <div
        key={item.id}
        className="grid items-stretch bg-white border rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
        style={{ gridTemplateColumns: "112px 1fr auto", borderColor: "#e5e7eb" }}
      >
        {/* Cover image */}
        <div className="w-28 h-24 shrink-0 bg-gray-50 flex items-center justify-center">
          {item.coverImage ? (
            <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <FileText size={24} className="text-gray-300" />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5 px-4 py-3 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
            <span
              // className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              //   item.status === "published"
              //     ? "bg-green-100 text-green-800"
              //     // : item.status === "archived"
              //     ? "bg-gray-100 text-gray-600"
              //     : "bg-yellow-100 text-yellow-800"
              // }`}
            >
              {item.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {item.content?.replace(/#{1,6}\s|(\*+)/g, "").slice(0, 120)}…
          </p>
          <div className="flex items-center gap-4 mt-auto pt-1">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <User size={11} /> {item.authorId}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CalendarDays size={11} />
              {new Date(item.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Eye size={11} /> {item.viewCount?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-2 px-4">
          <button
            // onClick={() => router.push(`/blog/${item.id}/edit`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            // onClick={() => handleDelete(item.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    ))
  )  : (
          <p>No Blog Found</p>
        )}





      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        className='border-2'
      />

   
      <input
        placeholder="Slug"
        value={form.slug}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
      />


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


      <textarea
        placeholder="Excerpt"
        value={form.excerpt}
        onChange={(e) =>
          setForm({ ...form, excerpt: e.target.value })
        }
      />


      <textarea
        placeholder="Content"
        value={form.content}
        onChange={(e) =>
          setForm({ ...form, content: e.target.value })
        }
      />


      <input
        placeholder="Cover Image"
        value={form.coverImage}
        onChange={(e) =>
          setForm({ ...form, coverImage: e.target.value })
        }
      />


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


      <button onClick={handleSubmit}>
        Create Blog
      </button>
    </div>
  );
}