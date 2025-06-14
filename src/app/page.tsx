import { auth0 } from "@/lib/auth0";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();
  console.log(session);
  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-blue-700">
            Welcome to CRM Software
          </h1>
          <p className="mb-8 text-gray-600">
            Manage your customers, sales, and support efficiently in one place.
          </p>
          <div className="flex flex-col gap-4">
            <a href="/auth/login?screen_hint=signup">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Sign up
              </button>
            </a>
            <a href="/auth/login">
              <button className="w-full py-2 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                Log in
              </button>
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white rounded-xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Welcome, {session.user.name}!
        </h1>
        <p className="mb-6 text-gray-600">
          You are now logged in. Explore your dashboard and manage your
          customers with ease.
        </p>
        <a href="/auth/logout">
          <button className="w-full py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
            Log out
          </button>
        </a>
      </div>
    </main>
  );
}
