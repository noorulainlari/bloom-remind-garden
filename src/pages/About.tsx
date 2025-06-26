
import { StaticPage } from './StaticPage';

export const About = () => {
  const content = (
    <>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to Plant Care Tracker, your ultimate companion for keeping your indoor plants healthy and thriving!
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
      <p className="text-gray-700 mb-6">
        We believe that everyone can become a successful plant parent with the right tools and guidance. Our mission is to make plant care simple, accessible, and enjoyable for gardeners of all experience levels.
      </p>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
      <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
        <li>Free plant watering reminder system</li>
        <li>No signup required for basic features</li>
        <li>Email notifications for registered users</li>
        <li>Plant species database with care instructions</li>
        <li>Export functionality for your plant schedules</li>
        <li>Expert tips and guides through our blog</li>
      </ul>
      
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
      <p className="text-gray-700 mb-6">
        Unlike other plant care apps, we keep things simple and focused. You don't need to create an account to start using our basic features, but if you want email reminders, we've got you covered. Our tool works on all devices and is completely free to use.
      </p>
      
      <p className="text-gray-700">
        Join thousands of plant parents who trust Plant Care Tracker to keep their green friends healthy and happy!
      </p>
    </>
  );

  return (
    <StaticPage
      title="About Plant Care Tracker"
      metaTitle="About Us - Plant Care Tracker | Free Plant Reminder Tool"
      metaDescription="Learn about Plant Care Tracker, the free plant watering reminder tool trusted by thousands of plant parents worldwide."
      content={content}
    />
  );
};
