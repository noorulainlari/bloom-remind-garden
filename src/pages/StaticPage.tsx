
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

interface StaticPageProps {
  title: string;
  content: React.ReactNode;
  metaTitle?: string;
  metaDescription?: string;
}

export const StaticPage = ({ title, content, metaTitle, metaDescription }: StaticPageProps) => {
  document.title = metaTitle || title;
  if (metaDescription) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metaDescription);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-700">Plant Care Tracker</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
          <div className="prose prose-lg max-w-none">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
