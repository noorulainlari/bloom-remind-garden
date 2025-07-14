
import { Link } from 'react-router-dom';
import { Leaf, Camera } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-green-200 mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6 text-green-600 animate-leaf-sway" />
              <span className="text-lg font-bold text-green-700 font-lora">Plant Care Tracker</span>
            </div>
            <p className="text-green-600 text-sm mb-4 leading-relaxed">
              Never forget to water your plants again! Our free tool helps you create watering schedules and get email reminders for all your plants. No signup required - start tracking immediately! 🌱
            </p>
            <p className="text-green-500 text-xs">
              © 2024 Plant Care Tracker. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-4 font-lora">Tools & Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-green-600 hover:text-green-800 transition-colors">
                  Plant Care Tracker
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-green-600 hover:text-green-800 transition-colors flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  Plant Gallery
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-green-600 hover:text-green-800 transition-colors">
                  Plant Care Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-4 font-lora">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-green-600 hover:text-green-800 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-600 hover:text-green-800 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-4 font-lora">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-green-600 hover:text-green-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-green-600 hover:text-green-800 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-green-200">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors">
              <span className="animate-gentle-float">🌱</span>
              Start Using Plant Care Tracker - Free Forever
              <span className="animate-gentle-float">🌿</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
