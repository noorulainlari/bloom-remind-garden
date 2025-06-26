
import { StaticPage } from './StaticPage';

export const Contact = () => {
  const content = (
    <>
      <p className="text-lg text-gray-700 mb-6">
        Have questions about plant care or need help with our watering reminder tool? We'd love to hear from you!
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800">Email Support</h3>
              <p className="text-gray-600">hello@plantcaretracker.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Response Time</h3>
              <p className="text-gray-600">We typically respond within 24 hours</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Best Time to Contact</h3>
              <p className="text-gray-600">Monday - Friday, 9 AM - 5 PM EST</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Questions</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800">How do I set up email reminders?</h3>
              <p className="text-gray-600">Simply create a free account and you'll automatically receive email notifications when your plants need water.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Can I use the tool without signing up?</h3>
              <p className="text-gray-600">Yes! All features work without an account. Your data is saved locally on your device.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Is the service really free?</h3>
              <p className="text-gray-600">Absolutely! Our <a href="/" className="text-green-600 hover:underline">plant watering reminder tool</a> is completely free to use.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-3">Feedback & Suggestions</h2>
        <p className="text-green-700">
          We're always looking to improve our plant care tools. If you have suggestions for new features or plant species to add to our database, please let us know!
        </p>
      </div>
    </>
  );

  return (
    <StaticPage
      title="Contact Us"
      metaTitle="Contact Plant Care Tracker - Get Help with Plant Watering"
      metaDescription="Need help with plant care or our watering reminder tool? Contact our support team for assistance with plant scheduling and care tips."
      content={content}
    />
  );
};
