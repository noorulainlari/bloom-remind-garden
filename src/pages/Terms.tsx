
import { StaticPage } from './StaticPage';

export const Terms = () => {
  const content = (
    <>
      <p className="text-gray-700 mb-6">
        <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
      <p className="text-gray-700 mb-6">
        By accessing and using Plant Care Tracker, you accept and agree to be bound by the terms and provision of this agreement.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Use License</h2>
      <p className="text-gray-700 mb-4">
        Permission is granted to use Plant Care Tracker for personal, non-commercial plant care purposes. This license shall automatically terminate if you violate any of these restrictions.
      </p>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">You may not:</h3>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Use the service for any commercial purpose without permission</li>
        <li>Attempt to reverse engineer or copy our service</li>
        <li>Upload malicious content or spam</li>
        <li>Violate any applicable laws or regulations</li>
        <li>Share your account credentials with others</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
      <p className="text-gray-700 mb-6">
        We strive to maintain high service availability but cannot guarantee uninterrupted access. We may perform maintenance, updates, or modifications that temporarily affect service availability.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Content</h2>
      <p className="text-gray-700 mb-6">
        You retain ownership of any content you submit (plant names, notes, etc.). By using our service, you grant us permission to store and process this content to provide our service.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
      <p className="text-gray-700 mb-6">
        Plant Care Tracker provides general plant care guidance. We are not responsible for plant health outcomes. Always consult additional resources and consider your specific plants' needs and your local growing conditions.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
      <p className="text-gray-700 mb-6">
        In no event shall Plant Care Tracker be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use our service.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Termination</h2>
      <p className="text-gray-700 mb-6">
        We may terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
      <p className="text-gray-700 mb-6">
        We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
      <p className="text-gray-700">
        If you have any questions about these Terms of Service, please contact us at{' '}
        <a href="mailto:legal@plantcaretracker.com" className="text-green-600 hover:text-green-800">
          legal@plantcaretracker.com
        </a>
      </p>
    </>
  );

  return (
    <StaticPage
      title="Terms of Service"
      metaTitle="Terms of Service - Plant Care Tracker"
      metaDescription="Read the Terms of Service for Plant Care Tracker. Understand your rights and responsibilities when using our plant care service."
      content={content}
    />
  );
};
