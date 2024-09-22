import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen relative">
      <nav className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className="text-2xl font-bold">Assignment</span>
          </div>
          <ul className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 font-medium">
            <li>
              <Link
                href="/"
                className="hover:text-secondary-foreground transition-colors duration-200 flex items-center"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="hover:text-secondary-foreground transition-colors duration-200 flex items-center"
              >
                Dashboard
              </Link>
            </li>
          </ul>
          <div className="mt-4 sm:mt-0">
            <Button asChild variant="default" className="rounded">
              <Link href="/auth">Sign-in</Link>
            </Button>
          </div>
        </div>
      </nav>
      <h2 className="text-2xl font-semibold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        Welcome to the Page
      </h2>
    </main>
  );
}
