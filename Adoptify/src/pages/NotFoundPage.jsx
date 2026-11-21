import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Page not found</h1>
      <p className="mt-2 text-stone-600">
        That page doesn't exist. <Link to="/" className="text-teal-700 underline">Go back home</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;