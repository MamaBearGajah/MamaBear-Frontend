
import { BlogList } from "@/types";

export const mockBlogDetail: BlogList = {
  id: "mock-blog-1",
  title: "The Ultimate Breastfeeding Guide for New Mothers",
  excerpt:
    "Learn practical breastfeeding tips, common challenges, and expert advice for a smoother motherhood journey.",
  content: `
    <h2>Getting Started with Breastfeeding</h2>
    <p>
      Breastfeeding is a natural process, but it often requires patience and practice.
      Every mother and baby pair is unique.
    </p>

    <h2>Benefits of Breastfeeding</h2>
    <ul>
      <li>Provides essential nutrients</li>
      <li>Strengthens baby's immune system</li>
      <li>Promotes bonding between mother and baby</li>
    </ul>

    <h2>Common Challenges</h2>
    <p>
      Some mothers experience latch difficulties, engorgement, or concerns about milk supply.
      Seeking help early can make a significant difference.
    </p>
  `,
  coverImage: "/images/blog-placeholder.jpg",
  status: "published",
  author: {
    id: "1",
    firstName: "Mama",
    lastName: "Bear",
    role: "Lactation Consultant",
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};