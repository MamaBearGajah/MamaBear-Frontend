"use client";

import { useEffect, useState } from "react";

import { createBlog } from "@/lib/api/blog";
import {getAllBlogs, updateBlog, deleteBlog} from "@/lib/api/blog";
import { User, BlogCreateListParams, BlogUpdateListParams, BlogList } from "@/types";
import { mockBlogs } from "@/lib/blog/articlesData";
import { apiClient } from "@/lib/api/client";
import { CalendarDays, Eye, FileText, Pencil, Trash2, User, User, User } from "lucide-react";
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
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [blogId, setBlogId] = useState('blog id')
  const [title, setTitle] = useState('blog title');
  const [authorId, setauthorId] = useState('art-1');
  const [slug, setSlug] = useState('blog slug')
  const [content, setContent] = useState('blog content');
  const [excerpt, setExcerpt] = useState('blog excerpt');
  const [coverImage, setCoverImage] = useState('https://placehold.co/600x400')
  const [status, setStatus] = useState('draft');

  const [updateForm, setUpdateForm] = useState<BlogUpdateListParams>({
    title: "",
    authorId: "",
    slug: "",
    content: "",
    excerpt: "",
    coverImage: "",
    status: "draft",

  })


  

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

const handleUpdateBlog = async (selectedBlogId:string) => {
  if (!selectedBlogId) return;

  try {
    const payload: BlogUpdateListParams = {
      title,
      authorId,
      slug,
      content,
      excerpt,
      coverImage,
      status,
    };

    await updateBlog(selectedBlogId, payload);

    alert("Blog updated successfully");

    setOpenUpdateModal(false);
  } catch (err) {
    console.error("Failed to update blog:", err);
  }
};

  // function setSelectedBlogId(id: string) {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div style={{ padding: 20 }}>
      {
        openUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                Update Blog
              </h2>

              <form className="space-y-3">

                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <label htmlFor="authorId">Author ID</label>
                <input
                  type="text"
                  id="authorId"
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <label htmlFor="excerpt">Excerpt</label>
                <input
                  type="text"
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <label htmlFor="coverImage">Cover Image</label>
                <input
                  type="text"
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full border p-2 rounded"
                  rows={8}
                />

                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "published")
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>

                <div className="flex gap-2 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setOpenUpdateModal(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateBlog(selectedBlogId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Update Blog
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      <h1>Create Blog</h1>
        {blog && blog.length > 0 ? (
                blog.map((item) => (

                  
                  <div
                    key={item.id}
                    className="grid items-stretch bg-white border rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
                    style={{ gridTemplateColumns: "112px 1fr auto", borderColor: "#e5e7eb" }}
                  >
                    {/* {setBlogId(item.id)} */}

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
                      onClick={() => {
                        setSelectedBlogId(item.id);

                        setTitle(item.title);
                        setContent(item.content);
                        setSlug(item.slug);
                        setExcerpt(item.excerpt);
                        setCoverImage(item.coverImage);
                        setauthorId(item.authorId);
                        setStatus(item.status);

                        setOpenUpdateModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Pencil size={12} />
                      Edit
                    </button>
                      <button
                        onClick={() => deleteBlog(item.id)}
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