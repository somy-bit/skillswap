import Hero from "@/components/Hero";
import Link from "next/link";

export default function Home() {
  return (
   <main>
    <Hero />
    <div className="text-center py-8">
      <Link
        href="/sessions"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View My Sessions
      </Link>
    </div>
   </main>
  );
}
