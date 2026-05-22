export default function LoadingComponent() {
  return (
    <div className="flex gap-1 text-black">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:0.2s]">.</span>
      <span className="animate-bounce [animation-delay:0.4s]">.</span>
    </div>
  )
}