import { useRouter } from 'next/router';
import type { NextPage } from 'next';

const ErrorPage: NextPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const router = useRouter();
  const { error } = router.query;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error || 'An error occurred during authentication'}
          </p>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
