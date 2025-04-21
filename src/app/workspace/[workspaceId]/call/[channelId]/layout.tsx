export default function CallLayout({ children }: { children: React.ReactNode }) {
    return (
      <html>
        <body className="m-0 p-0 overflow-hidden">{children}</body>
      </html>
    );
  }