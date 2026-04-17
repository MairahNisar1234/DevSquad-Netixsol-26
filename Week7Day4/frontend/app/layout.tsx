import "./globals.css";
import ReduxProvider from "@/src/providers/redux.provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Everything inside here now has access to the Redux Store */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}