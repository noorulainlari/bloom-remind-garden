
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Droplets, Bell, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-700">Plant Care Tracker</h1>
            </div>
            <Link to="/">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Online Plant Watering Reminder – Never Forget to Water Again
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create a plant care schedule and get free email reminders. Track your indoor plants, 
            upload photos, and maintain a healthy garden with our easy-to-use tool.
          </p>
          <Link to="/">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Tracking Your Plants
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Plant Care
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>500+ Plant Database</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Choose from our extensive database of indoor plants with pre-set watering schedules, 
                  or add your own custom plants.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Droplets className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Smart Watering Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatic watering reminders based on each plant's specific needs. 
                  Track watering history and never overwater again.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Bell className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Email Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get timely email notifications when it's time to water your plants. 
                  Stay on top of your plant care routine effortlessly.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Photo Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload photos of your plants to track their growth and health. 
                  Create a visual diary of your plant care journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Plant Care Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Essential Plant Care Guides
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  The Complete Guide to Watering Indoor Plants
                </h3>
                <p className="text-gray-600 mb-4">
                  Proper watering is the foundation of healthy indoor plants. Most plant deaths occur due to overwatering rather than underwatering. 
                  The key is understanding your plant's specific needs and environmental factors like humidity, temperature, and season.
                </p>
                <p className="text-gray-600 mb-4">
                  Check soil moisture by inserting your finger 1-2 inches deep. If it feels dry, it's time to water. Water thoroughly until 
                  water drains from the bottom, ensuring the entire root system gets hydrated. Always use room temperature water to avoid shocking the roots.
                </p>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Understanding Light Requirements for Houseplants
                </h3>
                <p className="text-gray-600 mb-4">
                  Light is crucial for photosynthesis and plant health. Different plants have varying light requirements: low light (north-facing windows), 
                  medium light (east/west windows), and bright light (south-facing windows with some protection from direct sun).
                </p>
                <p className="text-gray-600 mb-4">
                  Signs of insufficient light include leggy growth, pale leaves, and dropped leaves. Too much light causes scorched or bleached leaves. 
                  Rotate plants weekly for even growth and consider grow lights for darker spaces.
                </p>
              </div>
            </article>

            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Common Plant Problems and Solutions
                </h3>
                <p className="text-gray-600 mb-4">
                  Yellow leaves often indicate overwatering or poor drainage. Brown leaf tips suggest low humidity or fluoride in tap water. 
                  Wilting can mean either under or overwatering - check soil moisture to determine the cause.
                </p>
                <p className="text-gray-600 mb-4">
                  Pest issues like spider mites, aphids, or scale insects require immediate attention. Inspect plants regularly and isolate 
                  affected plants. Use neem oil or insecticidal soap for organic treatment options.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Plant Care Tips Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Weekly Plant Care Tips
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <article className="border-b border-gray-200 pb-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                How to Create the Perfect Humidity for Tropical Plants
              </h3>
              <p className="text-gray-600 mb-4">
                Tropical houseplants like fiddle leaf figs, monstera, and peace lilies thrive in humidity levels between 40-60%. 
                Most homes maintain only 20-30% humidity, especially during winter months when heating systems dry out the air.
              </p>
              <p className="text-gray-600 mb-4">
                Increase humidity by grouping plants together, using pebble trays filled with water, or running a humidifier nearby. 
                Misting can help temporarily but shouldn't be your only solution as it can promote fungal issues if overdone.
              </p>
              <p className="text-gray-600">
                Signs your plants need more humidity include brown leaf edges, crispy leaves, and increased pest problems. 
                Monitor with a hygrometer and adjust your humidity strategies accordingly.
              </p>
            </article>

            <article className="border-b border-gray-200 pb-8">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Seasonal Plant Care: Adjusting Your Routine Throughout the Year
              </h3>
              <p className="text-gray-600 mb-4">
                Plants have natural growth cycles that correspond with seasons. During spring and summer (growing season), 
                plants need more frequent watering, regular fertilizing, and may require repotting as they actively grow.
              </p>
              <p className="text-gray-600 mb-4">
                Fall and winter represent dormancy for most houseplants. Reduce watering frequency, stop fertilizing, 
                and provide extra humidity to combat dry indoor air. This is also the perfect time to plan for spring growth.
              </p>
              <p className="text-gray-600">
                Watch for signs that your plants are entering dormancy: slower growth, less water uptake, and some leaf drop is normal. 
                Adjust your care routine accordingly to prevent overwatering during these slower months.
              </p>
            </article>

            <article>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                The Science Behind Plant Nutrition and Fertilizing
              </h3>
              <p className="text-gray-600 mb-4">
                Plants need three primary nutrients: nitrogen (N) for leaf growth, phosphorus (P) for root development and flowering, 
                and potassium (K) for overall plant health and disease resistance. Secondary nutrients include calcium, magnesium, and sulfur.
              </p>
              <p className="text-gray-600 mb-4">
                During growing season (spring/summer), fertilize every 2-4 weeks with a balanced, water-soluble fertilizer diluted to half strength. 
                Over-fertilizing can cause salt buildup and burn roots, so less is often more.
              </p>
              <p className="text-gray-600">
                Signs of nutrient deficiency include yellowing leaves (nitrogen), poor root growth (phosphorus), or brown leaf edges (potassium). 
                Always water before fertilizing and flush soil monthly to prevent salt accumulation.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Keep Your Plants Healthy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of plant lovers who never forget to water their plants.
          </p>
          <Link to="/">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="h-6 w-6 text-green-400" />
                <span className="text-lg font-semibold">Plant Care Tracker</span>
              </div>
              <p className="text-gray-400">
                Your reliable companion for indoor plant care and watering reminders.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Plant Database</li>
                <li>Watering Reminders</li>
                <li>Photo Upload</li>
                <li>Care Schedule</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>Help Center</li>
                <li>Plant Care Tips</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>About Us</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Plant Care Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
