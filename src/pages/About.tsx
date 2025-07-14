import { StaticPage } from './StaticPage';

export const About = () => {
  const content = (
    <>
      <p className="text-lg text-gray-700 mb-8">
        Plant Care Tracker was created by passionate plant enthusiasts who understand the challenges of keeping houseplants healthy and thriving.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
      <p className="text-gray-700 mb-6">
        We believe everyone should be able to enjoy the benefits of indoor plants without the stress of forgetting to care for them. 
        Our mission is to make plant care simple, accessible, and successful for plant parents of all experience levels.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why We Built This Tool</h2>
      <p className="text-gray-700 mb-4">
        After experiencing too many plant casualties from inconsistent watering schedules, we realized there needed to be a better way. 
        Most plant care apps are overcomplicated or require expensive subscriptions.
      </p>
      <p className="text-gray-700 mb-6">
        Plant Care Tracker is completely free and focuses on the most critical aspect of plant care: consistent watering. 
        No unnecessary features, no hidden costs - just a reliable reminder system that works.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Makes Us Different</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li><strong>Completely Free:</strong> No subscriptions, no premium features, no ads interrupting your experience</li>
        <li><strong>Privacy First:</strong> Use without an account, or create one only for email reminders</li>
        <li><strong>Simple & Effective:</strong> Focus on what matters most - keeping your plants watered</li>
        <li><strong>Expert Knowledge:</strong> Built-in care guides based on horticultural best practices</li>
        <li><strong>Community Driven:</strong> Continuously improved based on real user feedback</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Plant Care Philosophy</h2>
      <p className="text-gray-700 mb-4">
        We believe plant care should be enjoyable, not stressful. Every plant is different, and successful care comes from understanding 
        your specific plants' needs rather than following rigid schedules.
      </p>
      <p className="text-gray-700 mb-6">
        Our tool provides structure and reminders while encouraging you to observe your plants and adjust care based on their actual needs. 
        The best plant parent is an attentive one, and we're here to support that journey.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Looking Forward</h2>
      <p className="text-gray-700 mb-6">
        We're constantly working to improve Plant Care Tracker based on user feedback and new research in plant care. 
        Our goal is to remain the most reliable, user-friendly plant care tool available - always free, always focused on what matters most.
      </p>
      
      <div className="mt-8 p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-2">Get Started Today</h3>
        <p className="text-green-700 mb-4">
          Join thousands of successful plant parents who trust Plant Care Tracker to keep their plants healthy and thriving.
        </p>
        <a href="/" className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
          Start Tracking Your Plants
        </a>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700">
          <strong>Questions or Feedback?</strong> We'd love to hear from you! Contact us at hello@plantcaretracker.com
        </p>
      </div>
    </>
  );

  return (
    <StaticPage
      title="About Plant Care Tracker"
      metaTitle="About Us - Plant Care Tracker Team & Mission"
      metaDescription="Learn about the team behind Plant Care Tracker, our mission to make plant care simple, and why we built the best free plant watering reminder tool."
      content={content}
    />
  );
};