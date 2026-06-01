export default function getDaysAgo(createdAt?: string | Date) {
  if (!createdAt) return "-";

  const created = new Date(createdAt);
  const now = new Date();

  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";

  return `${diffDays} days ago`;
}