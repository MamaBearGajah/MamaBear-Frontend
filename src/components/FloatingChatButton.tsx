import Link from "next/link";
import { MessageCircle } from "lucide-react";

type FloatingChatButtonProps = {
  href?: string;
};

export default function FloatingChatButton({
  href = "#",
}: FloatingChatButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Open chat"
      className="fixed right-5 bottom-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#D5557E] text-white shadow-[0_10px_24px_rgba(108,71,53,0.2)] transition hover:scale-105 hover:opacity-95"
    >
      <MessageCircle size={26} strokeWidth={2.3} />
    </Link>
  );
}
