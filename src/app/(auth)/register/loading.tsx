import LoadingComponent from "@/components/LoadingComponent";
const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <img src="/loading.gif" alt="Loading..." className="rounded-md" />
      </div>
      <h2>
        Loading <LoadingComponent />
      </h2>
    </div>
  );
};

export default Loading;
