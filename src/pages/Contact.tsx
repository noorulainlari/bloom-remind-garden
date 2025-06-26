
import { StaticPage } from './StaticPage';

export const Contact = () => {
  const content = (
    <>
      <p className="text-lg text-gray-700 mb-6">
        We'd love to hear from you! Whether you have questions, suggestions, or just want to share your plant care success stories, we're here to help.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
      <div className="bg-green-50 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Email Us</h3>
        <p className="text-green-700">
          For general inquiries: <a href="mailto:hello@plantcaretracker.com" className="text-green-600 hover:text-green-800">hello@plantcaretracker.com</a>
        </p>
        <p className="text-green-700">
          For technical support: <a href="mailto:support@plantcaretracker.com" className="text-green-600 hover:text-green-800">support@plantcaretracker.com</a>
        </p>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Do I need to create an account?</h3>
          <p className="text-gray-700">No! You can use all basic features without signing up. Creating an account is only needed if you want email reminders.</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Is the service really free?</h3>
          <p className="text-gray-700">Yes, Plant Care Tracker is completely free to use. We believe everyone should have access to proper plant care tools.</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Can I use this on my phone?</h3>
          <p className="text-gray-700">Absolutely! Our tool works on all devices - desktop, tablet, and mobile. No app download required.</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">How do I export my plant schedule?</h3>
          <p className="text-gray-700">Click the "Export Schedule" button on the main dashboard to download a CSV file with all your plant information.</p>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-8">Response Time</h2>
      <p className="text-gray-700">
        We typically respond to all inquiries within 24-48 hours. For urgent technical issues, please include "URGENT" in your subject line.
      </p>
    </>
  );

  return (
    <StaticPage
      title="Contact Us"
      metaTitle="Contact Plant Care Tracker - Get Help & Support"
      metaDescription="Contact Plant Care Tracker for support, questions, or feedback. We're here to help you succeed with your plant care journey."
      content={content}
    />
  );
};
