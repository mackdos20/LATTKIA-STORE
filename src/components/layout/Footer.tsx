import { useTheme } from "./theme-provider";

export function Footer() {
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  
  return (
    <footer className={`w-full py-6 ${theme === "dark" ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {year} Photo Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}