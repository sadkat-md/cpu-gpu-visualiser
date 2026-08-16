import Link from "next/link";

export default function NotFound() {
  return (
    <div className="viewport grid place-items-center px-6">
      <div className="hud-glass max-w-md p-8">
        <p className="kicker text-[#6ee7ff]">404</p>
        <h1 className="mt-2 text-3xl font-medium">Off-die address</h1>
        <p className="mt-3 text-sm text-muted">No projection at this path.</p>
        <Link href="/" className="chip mt-6 inline-block text-[#6ee7ff]">
          Return to Atlas
        </Link>
      </div>
    </div>
  );
}
