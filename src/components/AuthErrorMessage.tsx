function AuthErrorMessage({ error }: { error: string }) {
  return (
    <div className="mb-4 rounded-md bg-[#D5557E]/10 p-2 text-sm text-red-500">
      {error}
    </div>
  );
}

export default AuthErrorMessage;
