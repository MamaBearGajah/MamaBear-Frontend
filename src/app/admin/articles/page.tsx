"use client";

import { useEffect, useState } from "react";

import { createBlog } from "@/lib/api/blog";
import {getAllBlogs, updateBlog, deleteBlog} from "@/lib/api/blog";
import { User, BlogCreateListParams, BlogUpdateListParams, BlogList } from "@/types";
import { mockBlogs } from "@/lib/blog/articlesData";
import { apiClient } from "@/lib/api/client";
import { CalendarDays, Eye, FileText, Pencil, Trash2, User, User, User, Newspaper, Plus } from "lucide-react";
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
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [blogId, setBlogId] = useState('blog id')
  const [title, setTitle] = useState('blog title');
  const [authorId, setauthorId] = useState('art-1');
  const [slug, setSlug] = useState('blog slug')
  const [content, setContent] = useState('blog content');
  const [excerpt, setExcerpt] = useState('blog excerpt');
  const [coverImage, setCoverImage] = useState('https://placehold.co/600x400')
  const [status, setStatus] = useState('draft');

  const [updateForm, setUpdateForm] = useState<BlogUpdateListParams>({
    // title: "",
    // authorId: "",
    // slug: "",
    // content: "",
    // excerpt: "",
    // coverImage: "",
    // status: "draft",

    title:"",
    slug:"",
    excerpt: "",
    coverImage: "",
    coverPublicId: "",
    status: "draft",
    content: "",



  })


  

  const [form, setForm] = useState<BlogCreateListParams>({
    // title: "",
    // authorId: "",
    // slug: "",
    // content: "",
    // excerpt: "",
    // coverImage: "",
    // status: "draft",

    title:"",
    slug:"",
    excerpt: "",
    coverImage: "",
    coverPublicId: "",
    status: "draft",
    content: "",
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
        // title: "",
        // authorId: "",
        // slug: "",
        // content: "",
        // excerpt: "",
        // coverImage: "",
        // status: "draft",

        title:"",
        slug:"",
        excerpt: "",
        coverImage: "",
        coverPublicId: "",
        status: "draft",
        content: "",
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
      // authorId,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => setOpenUpdateModal(false)}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpenUpdateModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          Update Blog
        </h2>

        <form className="space-y-3">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* <div>
            <label htmlFor="authorId" className="block mb-1 font-medium">
              Author ID
            </label>
            <input
              type="text"
              id="authorId"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div> */}

          <div>
            <label htmlFor="slug" className="block mb-1 font-medium">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block mb-1 font-medium">
              Excerpt
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block mb-1 font-medium">
              Cover Image
            </label>
            <input
              type="text"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label htmlFor="content" className="block mb-1 font-medium">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border p-2 rounded"
              rows={8}
            />
          </div>

          <div>
            <label htmlFor="status" className="block mb-1 font-medium">
              Status
            </label>
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
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <button
              type="button"
              onClick={() => setOpenUpdateModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleUpdateBlog(selectedBlogId)}
              className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
            >
              Update Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
<div className='flex justify-between items-center'>

        Articles ({blog.length})
        <button 
          type='button'
          className='text-white flex justify-center items-center mr-3 gap-3 border-2 p-2 m-3 bg-dark-pink hover:opacity-80 cursor-pointer transition duration-300 rounded-lg' 
          onClick={() => setOpenCreateModal((prev)=>!prev)}><Plus size={20}></Plus>
            Add Article
        </button>

</div>

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




       {openCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setOpenCreateModal(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Blog
              </h2>

              <button
                type="button"
                onClick={() => setOpenCreateModal(false)}
                className="text-gray-400 bg-dark-pink hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div>
                <label
                  htmlFor="createtitle"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  id="createtitle"
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter blog title"
                />
              </div>

              <div>
                <label
                  htmlFor="createslug"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Slug
                </label>
                <input
                  id="createslug"
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="my-blog-post"
                />
              </div>

              {/* <div>
                <label
                  htmlFor="createauthorid"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Author
                </label>

                <select
                  id="createauthorid"
                  value={form.authorId}
                  onChange={(e) =>
                    setForm({ ...form, authorId: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Author</option>

                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div> */}

              <div>
                <label
                  htmlFor="createexcerpt"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Excerpt
                </label>

                <textarea
                  id="createexcerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) =>
                    setForm({ ...form, excerpt: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Short description..."
                />
              </div>

              <div>
                <label
                  htmlFor="createcontent"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Content
                </label>

                <textarea
                  id="createcontent"
                  rows={8}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your content here..."
                />
              </div>

              <div>
                <label
                  htmlFor="createcoverimage"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Cover Image URL
                </label>

                <input
                  id="createcoverimage"
                  type="text"
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm({ ...form, coverImage: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label
                  htmlFor="createstatus"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <select
                  id="createstatus"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenCreateModal(false)}
                  className="px-4 py-2 border bg-dark-pink border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-dark-pink text-white rounded-lg hover:bg-blue-700"
                >
                  Create Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}