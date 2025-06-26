
import { StaticPage } from './StaticPage';

export const Privacy = () => {
  const content = (
    <>
      <p className="text-gray-600 mb-6">
        <strong>Last updated:</strong> December 2024
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Information</h3>
      <p className="text-gray-700 mb-4">
        When you create an account, we collect your email address to send watering reminders and enable account access.
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Plant Data</h3>
      <p className="text-gray-700 mb-4">
        We store information about your plants including names, watering schedules, and photos you choose to upload. This data is private to your account.
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Local Storage</h3>
      <p className="text-gray-700 mb-6">
        If you use our tool without creating an account, your plant data is stored locally on your device only. We cannot access this information.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Send email reminders for plant watering schedules</li>
        <li>Provide access to your saved plants across devices</li>
        <li>Improve our service and add new features</li>
        <li>Respond to support requests</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
      <p className="text-gray-700 mb-6">
        We use industry-standard security measures to protect your data. All data is encrypted and stored securely using Supabase infrastructure.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Access your personal data at any time through your account</li>
        <li>Delete your account and all associated data</li>
        <li>Export your plant data using our CSV export feature</li>
        <li>Opt out of email reminders while keeping your account</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
      <p className="text-gray-700 mb-6">
        We use Supabase for data storage and authentication. We may use analytics services to improve our tool. We do not sell your personal information to third parties.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
      <p className="text-gray-700">
        If you have questions about this privacy policy or your data, please contact us at privacy@plantcaretracker.com
      </p>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <p className="text-green-700">
          <strong>Remember:</strong> You can use our <a href="/" className="text-green-600 hover:underline">plant watering reminder tool</a> completely anonymously without creating an account. Your privacy is important to us.
        </p>
      </div>
    </>
  );

  return (
    <StaticPage
      title="Privacy Policy"
      metaTitle="Privacy Policy - Plant Care Tracker Data Protection"
      metaDescription="Learn how Plant Care Tracker protects your privacy and handles your plant care data. Transparent privacy policy for our watering reminder tool."
      content={content}
    />
  );
};
