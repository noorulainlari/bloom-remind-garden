
import { StaticPage } from './StaticPage';

export const Privacy = () => {
  const content = (
    <>
      <p className="text-gray-700 mb-6">
        <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Account Information</h3>
      <p className="text-gray-700 mb-4">
        If you choose to create an account, we collect your email address to send you plant care reminders. Account creation is optional - you can use our basic features without signing up.
      </p>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Plant Data</h3>
      <p className="text-gray-700 mb-4">
        We store information about your plants (names, watering schedules, care notes) to provide our service. For users without accounts, this data is stored locally in your browser.
      </p>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Usage Information</h3>
      <p className="text-gray-700 mb-6">
        We may collect anonymous usage statistics to improve our service, such as which features are most popular.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Send you plant watering reminders (if you have an account)</li>
        <li>Provide and improve our plant care service</li>
        <li>Respond to your support requests</li>
        <li>Analyze usage patterns to enhance user experience</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
      <p className="text-gray-700 mb-6">
        We do not sell, trade, or share your personal information with third parties, except as described in this policy or with your consent.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
      <p className="text-gray-700 mb-6">
        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Delete your account and data</li>
        <li>Export your plant data</li>
        <li>Opt out of email communications</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
      <p className="text-gray-700 mb-6">
        We use cookies to improve your experience and remember your preferences. You can disable cookies in your browser settings, though some features may not work properly.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
      <p className="text-gray-700">
        If you have questions about this Privacy Policy, please contact us at{' '}
        <a href="mailto:privacy@plantcaretracker.com" className="text-green-600 hover:text-green-800">
          privacy@plantcaretracker.com
        </a>
      </p>
    </>
  );

  return (
    <StaticPage
      title="Privacy Policy"
      metaTitle="Privacy Policy - Plant Care Tracker"
      metaDescription="Learn how Plant Care Tracker protects your privacy and handles your personal information. We're committed to keeping your data safe."
      content={content}
    />
  );
};
