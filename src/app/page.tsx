import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth0.getSession();
  if (session) {
    // Insert user in DB
    await fetch("https://blackryce-crm.vercel.app/api/auth/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: session.user.name,
        email: session.user.email,
        sub: session.user.sub,
      }),
    });

    // Redirect based on role from session
    if (session) {
      redirect(`/dashboard`);
    }

    // console.log(session);
  }
  return (
    <main
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/bg/1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 border border-white/20 rounded-2xl shadow-2xl p-12 text-center bg-white/10 backdrop-blur-lg max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-3 text-white drop-shadow-lg tracking-tight">
          Welcome to <span className="text-blue-400">CRM Software</span>
        </h1>
        <p className="mb-8 text-lg text-gray-200 font-medium">
          Manage your customers, sales, and support efficiently in one place.
        </p>

        <div className="flex flex-col gap-4">
          <a href="/auth/login?screen_hint=signup">
            <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl font-bold shadow-md hover:scale-105 hover:from-blue-600 hover:to-blue-800 transition-all duration-200">
              Sign up
            </button>
          </a>
          <a href="/auth/login">
            <button className="w-full py-3 px-4 bg-white/80 border border-blue-600 text-blue-700 rounded-xl font-bold shadow-md hover:bg-blue-50 hover:text-blue-900 transition-all duration-200">
              Log in
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}
