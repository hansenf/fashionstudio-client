import { LoginForm } from '@/components/auth/LoginForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const cookieStore = await cookies();
  if (cookieStore.get('__session')) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Fashion Studio <br />
            <span className="text-purple-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mt-4">
            Design apparel with AI. Generate, edit, and collaborate.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
          <video
            src="/videos/preview.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full aspect-video object-cover bg-gray-800"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </main>
  );
}