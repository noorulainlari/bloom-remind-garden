
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Leaf, 
  Settings, 
  User, 
  Menu, 
  X,
  Gallery,
  BookOpen,
  Contact
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/gallery', label: 'Gallery', icon: Gallery },
  { path: '/blog', label: 'Blog', icon: BookOpen },
  { path: '/about', label: 'About', icon: Contact },
];

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-green-700">Plant Care Tracker</h1>
        </div>
        
        <div className="flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-green-100 text-green-800 font-semibold'
                  : 'text-green-700 hover:bg-green-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          
          {user && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                {user.email?.split('@')[0]}
              </span>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden flex items-center justify-between w-full px-4 py-4">
        <div className="flex items-center gap-3">
          <Leaf className="h-6 w-6 text-green-600" />
          <h1 className="text-lg font-bold text-green-700">Plant Care</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-green-700"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white">
          <div className="flex flex-col p-4 space-y-4 mt-16">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-800 font-semibold'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                <item.icon className="h-6 w-6" />
                {item.label}
              </Link>
            ))}
            
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-lg mt-6">
                <User className="h-6 w-6 text-green-600" />
                <span className="font-semibold text-green-800">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-200 z-30">
        <div className="flex justify-around py-2">
          {navigationItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'text-green-800 bg-green-50'
                  : 'text-green-600'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
