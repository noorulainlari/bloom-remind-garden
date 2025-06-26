
import { StaticPage } from './StaticPage';

export const Terms = () => {
  const content = (
    <>
      <p className="text-gray-600 mb-6">
        <strong>Last updated:</strong> December 2024
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
      <p className="text-gray-700 mb-6">
        By using Plant Care Tracker, you agree to these terms of service. If you don't agree with any part of these terms, please don't use our service.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Description</h2>
      <p className="text-gray-700 mb-6">
        Plant Care Tracker is a free tool that helps you schedule and track watering for your plants. We provide reminders via email for registered users and local storage for anonymous users.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Provide accurate information when creating an account</li>
        <li>Keep your account credentials secure</li>
        <li>Use the service only for lawful purposes</li>
        <li>Respect the intellectual property rights of others</li>
        <li>Not attempt to disrupt or damage our service</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
      <p className="text-gray-700 mb-6">
        We strive to keep our service available at all times, but we don't guarantee 100% uptime. We may temporarily suspend service for maintenance or updates.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content and Data</h2>
      <p className="text-gray-700 mb-4">
        You retain ownership of any content you upload (such as plant photos). By using our service, you grant us permission to store and process your data to provide the service.
      </p>
      <p className="text-gray-700 mb-6">
        We reserve the right to remove content that violates these terms or is inappropriate.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
      <p className="text-gray-700 mb-6">
        Plant Care Tracker provides general plant care information. We are not responsible for the health of your plants. Always research specific care requirements for your plants and consult with gardening experts when needed.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
      <p className="text-gray-700 mb-6">
        We provide our service "as is" without warranties. We are not liable for any damages arising from the use of our service, including but not limited to plant damage or loss.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Termination</h2>
      <p className="text-gray-700 mb-6">
        You may delete your account at any time. We may suspend or terminate accounts that violate these terms. Upon termination, your data will be deleted according to our privacy policy.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
      <p className="text-gray-700 mb-6">
        We may update these terms occasionally. Continued use of the service after changes constitutes acceptance of new terms.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
      <p className="text-gray-700">
        For questions about these terms, contact us at legal@plantcaretracker.com
      </p>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <p className="text-green-700">
          <strong>Free Service:</strong> Our <a href="/" className="text-green-600 hover:underline">plant watering reminder tool</a> is completely free to use. These terms help us provide the best possible service to all users.
        </p>
      </div>
    </>
  );

  return (
    <StaticPage
      title="Terms of Service"
      metaTitle="Terms of Service - Plant Care Tracker Usage Terms"
      metaDescription="Read the terms of service for Plant Care Tracker, our free plant watering reminder tool. Understand your rights and responsibilities."
      content={content}
    />
  );
};
