import { StaticPage } from './StaticPage';

export const Contact = () => {
  const content = (
    <>
      <p className="text-lg text-gray-700 mb-8">
        We'd love to hear from you! Whether you have questions, feedback, or need help with your plants, we're here to support your plant care journey.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-900 mb-4">General Inquiries</h2>
          <p className="text-green-700 mb-2">
            <strong>Email:</strong> hello@plantcaretracker.com
          </p>
          <p className="text-green-600 text-sm">
            Questions about our tool, suggestions for improvements, or general plant care questions.
          </p>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Technical Support</h2>
          <p className="text-blue-700 mb-2">
            <strong>Email:</strong> support@plantcaretracker.com
          </p>
          <p className="text-blue-600 text-sm">
            Having trouble with the app? Need help with your account or reminders? We're here to help!
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-purple-900 mb-4">Privacy & Data</h2>
          <p className="text-purple-700 mb-2">
            <strong>Email:</strong> privacy@plantcaretracker.com
          </p>
          <p className="text-purple-600 text-sm">
            Questions about your data, privacy policy, or account deletion requests.
          </p>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-orange-900 mb-4">Business Inquiries</h2>
          <p className="text-orange-700 mb-2">
            <strong>Email:</strong> business@plantcaretracker.com
          </p>
          <p className="text-orange-600 text-sm">
            Partnership opportunities, media inquiries, or business collaborations.
          </p>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
      
      <div className="space-y-6 mb-8">
        <div className="border-l-4 border-green-500 pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Do I need to create an account?</h3>
          <p className="text-gray-700">
            No! You can use Plant Care Tracker completely anonymously. Your data stays on your device. 
            Create an account only if you want email reminders or to sync across devices.
          </p>
        </div>
        
        <div className="border-l-4 border-blue-500 pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Is Plant Care Tracker really free?</h3>
          <p className="text-gray-700">
            Yes, completely free forever! No hidden costs, no premium features, no subscriptions. 
            We believe everyone should have access to proper plant care tools.
          </p>
        </div>
        
        <div className="border-l-4 border-purple-500 pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">How do email reminders work?</h3>
          <p className="text-gray-700">
            When you create an account, we'll send you email reminders based on each plant's watering schedule. 
            You can adjust frequencies or turn off reminders anytime in your account settings.
          </p>
        </div>
        
        <div className="border-l-4 border-red-500 pl-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">My plant is still dying, what should I do?</h3>
          <p className="text-gray-700">
            While we provide general care guidelines, every plant and environment is unique. Consider factors like light, 
            humidity, temperature, and soil drainage. For serious issues, consult your local nursery or a plant care expert.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Response Times</h2>
        <ul className="text-gray-700 space-y-2">
          <li><strong>Technical Support:</strong> Usually within 24 hours</li>
          <li><strong>General Inquiries:</strong> Within 2-3 business days</li>
          <li><strong>Privacy/Data Requests:</strong> Within 5 business days</li>
          <li><strong>Business Inquiries:</strong> Within 1 week</li>
        </ul>
      </div>
      
      <div className="mt-8 text-center">
        <a 
          href="/" 
          className="inline-block bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors text-lg"
        >
          Back to Plant Care Tracker
        </a>
      </div>
    </>
  );

  return (
    <StaticPage
      title="Contact Us"
      metaTitle="Contact Plant Care Tracker - Support & Help"
      metaDescription="Get help with Plant Care Tracker. Contact our support team for technical assistance, plant care questions, or general inquiries about our free watering reminder tool."
      content={content}
    />
  );
};