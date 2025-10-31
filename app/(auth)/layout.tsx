export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
      <footer className="text-center py-4 text-sm text-gray-600">
        © 2025 شهاداتي. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
