import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Leaf, Droplets, Bug, Scissors, Sun, Timer, Camera, Brain, Users, Shield, Heart, Zap, 
         Sparkles, Lightbulb, Target, TrendingUp, Award, Gift, Calendar, Bell, Clock, Thermometer, Gauge, 
         Activity, BarChart3, LineChart, PieChart, Microscope, FlaskConical, Dna, Atom, Globe, Mountain, 
         Wind, Cloud, Snowflake, Flower2, TreePine, Sprout, Apple, Cherry, Grape, Calculator, AlertTriangle, BookOpen } from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'available' | 'premium' | 'coming-soon';
  tags: string[];
}

const features: Feature[] = [
  // Care & Monitoring (15 features)
  { id: 'smart-watering', name: 'Smart Watering Schedule', description: 'AI-powered watering recommendations based on plant type, season, and environmental factors', category: 'care', icon: Droplets, status: 'available', tags: ['ai', 'automation', 'watering'] },
  { id: 'health-monitor', name: 'Plant Health Monitor', description: 'Real-time tracking of plant vitals including growth rate, leaf color, and overall wellness', category: 'care', icon: Heart, status: 'available', tags: ['monitoring', 'health', 'tracking'] },
  { id: 'disease-scanner', name: 'Disease Scanner', description: 'Photo-based disease detection using machine learning to identify common plant ailments', category: 'care', icon: Microscope, status: 'available', tags: ['ai', 'disease', 'detection'] },
  { id: 'pest-identifier', name: 'Pest Identifier', description: 'Identify and get treatment recommendations for common garden pests and insects', category: 'care', icon: Bug, status: 'available', tags: ['pests', 'identification', 'treatment'] },
  { id: 'growth-tracker', name: 'Growth Progress Tracker', description: 'Visual timeline showing your plant\'s growth with photo comparisons and measurements', category: 'care', icon: TrendingUp, status: 'available', tags: ['growth', 'progress', 'timeline'] },
  { id: 'fertilizer-guide', name: 'Smart Fertilizer Guide', description: 'Personalized fertilizer recommendations based on soil analysis and plant needs', category: 'care', icon: Zap, status: 'available', tags: ['fertilizer', 'nutrients', 'soil'] },
  { id: 'pruning-assistant', name: 'Pruning Assistant', description: 'Step-by-step pruning guides with timing recommendations for different plant types', category: 'care', icon: Scissors, status: 'available', tags: ['pruning', 'maintenance', 'timing'] },
  { id: 'light-optimizer', name: 'Light Condition Optimizer', description: 'Measure and optimize light conditions for maximum plant growth and health', category: 'care', icon: Sun, status: 'available', tags: ['light', 'optimization', 'environment'] },
  { id: 'soil-analyzer', name: 'Soil Health Analyzer', description: 'Comprehensive soil testing and analysis with improvement recommendations', category: 'care', icon: FlaskConical, status: 'premium', tags: ['soil', 'analysis', 'chemistry'] },
  { id: 'humidity-control', name: 'Humidity Controller', description: 'Monitor and control humidity levels with smart device integration', category: 'care', icon: Gauge, status: 'premium', tags: ['humidity', 'environment', 'automation'] },
  { id: 'temperature-alerts', name: 'Temperature Alerts', description: 'Get notified when temperature conditions become harmful to your plants', category: 'care', icon: Thermometer, status: 'available', tags: ['temperature', 'alerts', 'protection'] },
  { id: 'seasonal-care', name: 'Seasonal Care Guide', description: 'Seasonal care recommendations and task lists for year-round plant health', category: 'care', icon: Calendar, status: 'available', tags: ['seasonal', 'calendar', 'tasks'] },
  { id: 'plant-rotation', name: 'Plant Rotation Planner', description: 'Optimize plant placement and rotation for maximum light exposure and growth', category: 'care', icon: Target, status: 'available', tags: ['rotation', 'placement', 'optimization'] },
  { id: 'emergency-care', name: 'Emergency Care Center', description: 'Quick diagnosis and treatment for plant emergencies and critical conditions', category: 'care', icon: Shield, status: 'available', tags: ['emergency', 'rescue', 'treatment'] },
  { id: 'care-automation', name: 'Care Automation Hub', description: 'Automate watering, lighting, and fertilizing with smart home integration', category: 'care', icon: Timer, status: 'premium', tags: ['automation', 'smart-home', 'iot'] },

  // Analytics & Insights (12 features)
  { id: 'growth-analytics', name: 'Growth Analytics Dashboard', description: 'Detailed analytics on growth patterns, care effectiveness, and optimization opportunities', category: 'analytics', icon: BarChart3, status: 'available', tags: ['analytics', 'dashboard', 'insights'] },
  { id: 'care-streak', name: 'Care Streak Tracker', description: 'Track your plant care consistency and build healthy gardening habits', category: 'analytics', icon: Activity, status: 'available', tags: ['habits', 'consistency', 'gamification'] },
  { id: 'plant-genetics', name: 'Plant Genetics Explorer', description: 'Explore your plant\'s genetic background and breeding potential', category: 'analytics', icon: Dna, status: 'premium', tags: ['genetics', 'breeding', 'science'] },
  { id: 'ecosystem-map', name: 'Garden Ecosystem Mapper', description: 'Visualize and optimize the relationships between plants in your garden ecosystem', category: 'analytics', icon: Globe, status: 'premium', tags: ['ecosystem', 'relationships', 'optimization'] },
  { id: 'yield-predictor', name: 'Harvest Yield Predictor', description: 'AI predictions for fruit and vegetable yields based on care history and conditions', category: 'analytics', icon: Apple, status: 'premium', tags: ['prediction', 'harvest', 'ai'] },
  { id: 'cost-tracker', name: 'Garden Cost Tracker', description: 'Track expenses and calculate ROI for your gardening investments', category: 'analytics', icon: PieChart, status: 'available', tags: ['finance', 'roi', 'budgeting'] },
  { id: 'carbon-footprint', name: 'Carbon Footprint Calculator', description: 'Calculate your garden\'s positive environmental impact and carbon offset', category: 'analytics', icon: Leaf, status: 'available', tags: ['environment', 'carbon', 'sustainability'] },
  { id: 'water-usage', name: 'Water Usage Analytics', description: 'Monitor and optimize water consumption with detailed usage reports', category: 'analytics', icon: Droplets, status: 'available', tags: ['water', 'conservation', 'efficiency'] },
  { id: 'time-investment', name: 'Time Investment Tracker', description: 'Track time spent on plant care and optimize your gardening schedule', category: 'analytics', icon: Clock, status: 'available', tags: ['time', 'efficiency', 'scheduling'] },
  { id: 'success-metrics', name: 'Success Metrics Dashboard', description: 'Comprehensive metrics on plant survival rates, growth success, and care effectiveness', category: 'analytics', icon: Award, status: 'available', tags: ['metrics', 'success', 'performance'] },
  { id: 'comparative-analysis', name: 'Comparative Plant Analysis', description: 'Compare performance across different plants and identify best practices', category: 'analytics', icon: LineChart, status: 'premium', tags: ['comparison', 'analysis', 'optimization'] },
  { id: 'trend-forecasting', name: 'Trend Forecasting', description: 'Predict future plant needs and potential issues using historical data patterns', category: 'analytics', icon: TrendingUp, status: 'premium', tags: ['forecasting', 'prediction', 'trends'] },

  // Community & Social (10 features)
  { id: 'plant-social', name: 'Plant Social Network', description: 'Connect with fellow gardeners, share experiences, and get advice from the community', category: 'social', icon: Users, status: 'available', tags: ['community', 'sharing', 'advice'] },
  { id: 'expert-consultation', name: 'Expert Consultation', description: 'Get personalized advice from certified horticulturists and plant experts', category: 'social', icon: Lightbulb, status: 'premium', tags: ['expert', 'consultation', 'professional'] },
  { id: 'plant-marketplace', name: 'Plant Marketplace', description: 'Buy, sell, and trade plants with other community members safely', category: 'social', icon: Gift, status: 'available', tags: ['marketplace', 'trading', 'commerce'] },
  { id: 'garden-tours', name: 'Virtual Garden Tours', description: 'Take virtual tours of beautiful gardens and get inspiration for your own space', category: 'social', icon: Camera, status: 'available', tags: ['tours', 'inspiration', 'virtual'] },
  { id: 'plant-sitting', name: 'Plant Sitting Network', description: 'Find trusted plant sitters in your area when you travel or need help', category: 'social', icon: Heart, status: 'coming-soon', tags: ['sitting', 'travel', 'help'] },
  { id: 'challenges', name: 'Gardening Challenges', description: 'Participate in monthly gardening challenges and compete with friends', category: 'social', icon: Target, status: 'available', tags: ['challenges', 'competition', 'gamification'] },
  { id: 'workshops', name: 'Live Workshops', description: 'Attend live gardening workshops and masterclasses from expert growers', category: 'social', icon: Users, status: 'premium', tags: ['workshops', 'education', 'live'] },
  { id: 'plant-adoption', name: 'Plant Adoption Center', description: 'Adopt plants that need new homes and help rescue neglected plants', category: 'social', icon: Heart, status: 'available', tags: ['adoption', 'rescue', 'charity'] },
  { id: 'local-groups', name: 'Local Gardening Groups', description: 'Find and join local gardening groups and clubs in your area', category: 'social', icon: Users, status: 'available', tags: ['local', 'groups', 'meetups'] },
  { id: 'knowledge-sharing', name: 'Knowledge Sharing Hub', description: 'Share your gardening knowledge and learn from others\' experiences', category: 'social', icon: Brain, status: 'available', tags: ['knowledge', 'sharing', 'learning'] },

  // Advanced Tools (13 features)
  { id: 'ar-plant-id', name: 'AR Plant Identification', description: 'Use augmented reality to instantly identify plants using your phone camera', category: 'tools', icon: Camera, status: 'premium', tags: ['ar', 'identification', 'camera'] },
  { id: 'ai-plant-doctor', name: 'AI Plant Doctor', description: 'Advanced AI diagnosis system that can identify complex plant health issues', category: 'tools', icon: Brain, status: 'premium', tags: ['ai', 'diagnosis', 'health'] },
  { id: 'garden-planner', name: '3D Garden Planner', description: 'Design and visualize your garden in 3D before planting', category: 'tools', icon: Mountain, status: 'premium', tags: ['3d', 'planning', 'design'] },
  { id: 'weather-integration', name: 'Weather Integration', description: 'Real-time weather data integration for optimal plant care timing', category: 'tools', icon: Cloud, status: 'available', tags: ['weather', 'timing', 'optimization'] },
  { id: 'iot-sensors', name: 'IoT Sensor Integration', description: 'Connect smart sensors for automated monitoring of soil, light, and humidity', category: 'tools', icon: Atom, status: 'premium', tags: ['iot', 'sensors', 'automation'] },
  { id: 'plant-scanner', name: 'Multi-Spectrum Plant Scanner', description: 'Advanced scanning technology to assess plant health beyond visible light', category: 'tools', icon: Microscope, status: 'premium', tags: ['scanning', 'health', 'technology'] },
  { id: 'propagation-lab', name: 'Propagation Laboratory', description: 'Virtual lab for tracking and optimizing plant propagation experiments', category: 'tools', icon: FlaskConical, status: 'premium', tags: ['propagation', 'experiments', 'lab'] },
  { id: 'climate-controller', name: 'Climate Controller', description: 'Smart climate control system for greenhouse and indoor gardens', category: 'tools', icon: Wind, status: 'premium', tags: ['climate', 'greenhouse', 'control'] },
  { id: 'harvest-optimizer', name: 'Harvest Optimizer', description: 'Optimize harvest timing for maximum yield and quality', category: 'tools', icon: Cherry, status: 'available', tags: ['harvest', 'timing', 'optimization'] },
  { id: 'seed-bank', name: 'Digital Seed Bank', description: 'Catalog and track your seed collection with planting reminders', category: 'tools', icon: Sprout, status: 'available', tags: ['seeds', 'catalog', 'tracking'] },
  { id: 'companion-planner', name: 'Companion Plant Planner', description: 'Plan optimal plant combinations for natural pest control and growth enhancement', category: 'tools', icon: TreePine, status: 'available', tags: ['companion', 'planning', 'optimization'] },
  { id: 'frost-protection', name: 'Frost Protection System', description: 'Early warning system and protection strategies for frost-sensitive plants', category: 'tools', icon: Snowflake, status: 'available', tags: ['frost', 'protection', 'alerts'] },
  { id: 'pollinator-garden', name: 'Pollinator Garden Designer', description: 'Design gardens specifically to attract and support pollinators', category: 'tools', icon: Flower2, status: 'available', tags: ['pollinators', 'design', 'ecology'] },

  // Additional 50 Features (51-100+)
  // Care & Monitoring - Extended (15 more)
  { id: 'micro-climate', name: 'Micro-Climate Monitor', description: 'Track micro-environmental conditions around individual plants', category: 'care', icon: Thermometer, status: 'premium', tags: ['micro-climate', 'precision', 'environment'] },
  { id: 'nutrient-tracker', name: 'Nutrient Deficiency Tracker', description: 'Visual identification and treatment of nutrient deficiencies', category: 'care', icon: Zap, status: 'available', tags: ['nutrients', 'deficiency', 'diagnosis'] },
  { id: 'watering-calculator', name: 'Precision Watering Calculator', description: 'Calculate exact watering amounts based on plant size and conditions', category: 'care', icon: Calculator, status: 'available', tags: ['precision', 'calculation', 'water'] },
  { id: 'transplant-guide', name: 'Transplant Success Guide', description: 'Step-by-step guidance for successful plant transplanting', category: 'care', icon: Scissors, status: 'available', tags: ['transplant', 'guidance', 'success'] },
  { id: 'dormancy-tracker', name: 'Plant Dormancy Tracker', description: 'Monitor and manage plants through dormant periods', category: 'care', icon: Clock, status: 'available', tags: ['dormancy', 'seasonal', 'tracking'] },
  { id: 'stress-detector', name: 'Plant Stress Detector', description: 'Early detection of plant stress through visual and environmental cues', category: 'care', icon: AlertTriangle, status: 'premium', tags: ['stress', 'early-detection', 'health'] },
  { id: 'ph-monitor', name: 'Soil pH Monitor', description: 'Continuous monitoring and alerts for soil pH levels', category: 'care', icon: FlaskConical, status: 'premium', tags: ['ph', 'soil', 'chemistry'] },
  { id: 'companion-care', name: 'Companion Plant Care', description: 'Coordinated care schedules for companion plant groupings', category: 'care', icon: Users, status: 'available', tags: ['companion', 'coordination', 'grouping'] },
  { id: 'quarantine-protocol', name: 'Plant Quarantine Protocol', description: 'Systematic quarantine procedures for new or sick plants', category: 'care', icon: Shield, status: 'available', tags: ['quarantine', 'protocol', 'safety'] },
  { id: 'recovery-program', name: 'Plant Recovery Program', description: 'Structured recovery plans for damaged or diseased plants', category: 'care', icon: Heart, status: 'available', tags: ['recovery', 'rehabilitation', 'treatment'] },
  { id: 'air-quality', name: 'Air Quality Monitor', description: 'Monitor how plants improve indoor air quality', category: 'care', icon: Wind, status: 'premium', tags: ['air-quality', 'indoor', 'health'] },
  { id: 'growth-booster', name: 'Growth Booster Protocols', description: 'Advanced techniques to accelerate healthy plant growth', category: 'care', icon: TrendingUp, status: 'premium', tags: ['growth', 'acceleration', 'techniques'] },
  { id: 'water-quality', name: 'Water Quality Tester', description: 'Test and optimize water quality for plant health', category: 'care', icon: Droplets, status: 'premium', tags: ['water-quality', 'testing', 'optimization'] },
  { id: 'sunlight-tracker', name: 'Daily Sunlight Tracker', description: 'Track actual sunlight exposure throughout the day', category: 'care', icon: Sun, status: 'available', tags: ['sunlight', 'tracking', 'daily'] },
  { id: 'plant-massage', name: 'Plant Stimulation Therapy', description: 'Gentle stimulation techniques to promote growth', category: 'care', icon: Heart, status: 'coming-soon', tags: ['stimulation', 'therapy', 'growth'] },

  // Analytics & Insights - Extended (15 more)
  { id: 'ai-predictions', name: 'AI Growth Predictions', description: 'Machine learning predictions for plant development', category: 'analytics', icon: Brain, status: 'premium', tags: ['ai', 'predictions', 'ml'] },
  { id: 'seasonal-analytics', name: 'Seasonal Performance Analytics', description: 'Compare plant performance across different seasons', category: 'analytics', icon: Calendar, status: 'available', tags: ['seasonal', 'performance', 'comparison'] },
  { id: 'efficiency-scores', name: 'Care Efficiency Scores', description: 'Rate and improve your plant care efficiency', category: 'analytics', icon: Target, status: 'available', tags: ['efficiency', 'scoring', 'improvement'] },
  { id: 'longevity-predictor', name: 'Plant Longevity Predictor', description: 'Estimate plant lifespan based on care quality', category: 'analytics', icon: Clock, status: 'premium', tags: ['longevity', 'prediction', 'lifespan'] },
  { id: 'benchmark-analysis', name: 'Care Benchmark Analysis', description: 'Compare your care against optimal standards', category: 'analytics', icon: BarChart3, status: 'available', tags: ['benchmark', 'standards', 'comparison'] },
  { id: 'habit-tracker', name: 'Gardening Habit Tracker', description: 'Track and improve your gardening habits over time', category: 'analytics', icon: Activity, status: 'available', tags: ['habits', 'improvement', 'tracking'] },
  { id: 'resource-optimizer', name: 'Resource Usage Optimizer', description: 'Optimize water, fertilizer, and energy usage', category: 'analytics', icon: Gauge, status: 'premium', tags: ['optimization', 'resources', 'efficiency'] },
  { id: 'mood-correlation', name: 'Plant Mood Correlation', description: 'Correlate your mood with plant care activities', category: 'analytics', icon: Heart, status: 'coming-soon', tags: ['mood', 'correlation', 'wellness'] },
  { id: 'space-utilization', name: 'Space Utilization Analytics', description: 'Optimize your growing space for maximum plants', category: 'analytics', icon: Target, status: 'available', tags: ['space', 'utilization', 'optimization'] },
  { id: 'disease-patterns', name: 'Disease Pattern Analysis', description: 'Identify patterns in plant disease occurrence', category: 'analytics', icon: Microscope, status: 'premium', tags: ['disease', 'patterns', 'analysis'] },
  { id: 'investment-roi', name: 'Gardening Investment ROI', description: 'Calculate return on investment for your garden', category: 'analytics', icon: PieChart, status: 'available', tags: ['roi', 'investment', 'financial'] },
  { id: 'productivity-index', name: 'Garden Productivity Index', description: 'Measure overall garden productivity and health', category: 'analytics', icon: TrendingUp, status: 'available', tags: ['productivity', 'index', 'measurement'] },
  { id: 'failure-analysis', name: 'Plant Failure Analysis', description: 'Learn from plant failures to prevent future issues', category: 'analytics', icon: AlertTriangle, status: 'available', tags: ['failure', 'analysis', 'learning'] },
  { id: 'growth-velocity', name: 'Growth Velocity Tracker', description: 'Track and analyze plant growth rates over time', category: 'analytics', icon: LineChart, status: 'premium', tags: ['velocity', 'growth-rate', 'tracking'] },
  { id: 'care-consistency', name: 'Care Consistency Monitor', description: 'Monitor and improve care routine consistency', category: 'analytics', icon: Clock, status: 'available', tags: ['consistency', 'routine', 'monitoring'] },

  // Community & Social - Extended (10 more)
  { id: 'plant-dating', name: 'Plant Parent Dating', description: 'Connect with other plant parents for friendship and advice', category: 'social', icon: Heart, status: 'coming-soon', tags: ['dating', 'friendship', 'connection'] },
  { id: 'skill-exchange', name: 'Skill Exchange Platform', description: 'Exchange gardening skills and knowledge with others', category: 'social', icon: Brain, status: 'available', tags: ['skills', 'exchange', 'learning'] },
  { id: 'plant-therapy', name: 'Plant Therapy Groups', description: 'Join therapeutic gardening groups for mental wellness', category: 'social', icon: Heart, status: 'premium', tags: ['therapy', 'wellness', 'groups'] },
  { id: 'global-garden', name: 'Global Garden Network', description: 'Connect with gardeners worldwide for cultural exchange', category: 'social', icon: Globe, status: 'available', tags: ['global', 'cultural', 'network'] },
  { id: 'mentor-program', name: 'Gardening Mentor Program', description: 'Get paired with experienced gardening mentors', category: 'social', icon: Users, status: 'premium', tags: ['mentorship', 'guidance', 'experience'] },
  { id: 'plant-rescue', name: 'Plant Rescue Network', description: 'Coordinate plant rescue and rehabilitation efforts', category: 'social', icon: Shield, status: 'available', tags: ['rescue', 'rehabilitation', 'network'] },
  { id: 'seed-swap', name: 'Global Seed Swap', description: 'Exchange rare and unique seeds with gardeners worldwide', category: 'social', icon: Gift, status: 'available', tags: ['seeds', 'exchange', 'rare'] },
  { id: 'garden-stories', name: 'Garden Story Sharing', description: 'Share and read inspiring gardening stories', category: 'social', icon: BookOpen, status: 'available', tags: ['stories', 'inspiration', 'sharing'] },
  { id: 'live-consultations', name: 'Live Expert Consultations', description: 'Book live video calls with plant experts', category: 'social', icon: Camera, status: 'premium', tags: ['live', 'video', 'expert'] },
  { id: 'plant-influencers', name: 'Plant Influencer Network', description: 'Follow and learn from top plant influencers', category: 'social', icon: Users, status: 'available', tags: ['influencers', 'following', 'learning'] },

  // Advanced Tools - Extended (10 more)
  { id: 'dna-analysis', name: 'Plant DNA Analysis', description: 'Analyze plant genetics for optimal care strategies', category: 'tools', icon: Dna, status: 'premium', tags: ['dna', 'genetics', 'analysis'] },
  { id: 'holographic-garden', name: 'Holographic Garden Planner', description: 'Plan your garden using holographic visualization', category: 'tools', icon: Sparkles, status: 'coming-soon', tags: ['holographic', 'visualization', 'future'] },
  { id: 'nano-sensors', name: 'Nano Sensor Network', description: 'Deploy nano-sensors for ultra-precise monitoring', category: 'tools', icon: Atom, status: 'premium', tags: ['nano', 'sensors', 'precision'] },
  { id: 'quantum-growth', name: 'Quantum Growth Enhancement', description: 'Use quantum field technology to enhance plant growth', category: 'tools', icon: Zap, status: 'coming-soon', tags: ['quantum', 'enhancement', 'future'] },
  { id: 'robotic-care', name: 'Robotic Plant Care', description: 'Automated robotic systems for plant maintenance', category: 'tools', icon: Brain, status: 'premium', tags: ['robotic', 'automation', 'maintenance'] },
  { id: 'satellite-monitoring', name: 'Satellite Garden Monitoring', description: 'Monitor large gardens using satellite imagery', category: 'tools', icon: Globe, status: 'premium', tags: ['satellite', 'monitoring', 'large-scale'] },
  { id: 'bio-feedback', name: 'Plant Bio-Feedback System', description: 'Real-time communication with plants through bio-signals', category: 'tools', icon: Activity, status: 'coming-soon', tags: ['bio-feedback', 'communication', 'signals'] },
  { id: 'weather-machine', name: 'Personal Weather Machine', description: 'Create optimal weather conditions for your plants', category: 'tools', icon: Cloud, status: 'coming-soon', tags: ['weather', 'control', 'optimal'] },
  { id: 'time-lapse', name: 'Automated Time-lapse Creator', description: 'Create beautiful time-lapse videos of plant growth', category: 'tools', icon: Camera, status: 'available', tags: ['time-lapse', 'video', 'growth'] },
  { id: 'virtual-botanist', name: 'Virtual Botanist AI', description: 'AI botanist available 24/7 for plant questions', category: 'tools', icon: Brain, status: 'premium', tags: ['ai', 'botanist', '24-7'] },
];

const categories = [
  { id: 'all', name: 'All Features', icon: Sparkles },
  { id: 'care', name: 'Care & Monitoring', icon: Heart },
  { id: 'analytics', name: 'Analytics & Insights', icon: BarChart3 },
  { id: 'social', name: 'Community & Social', icon: Users },
  { id: 'tools', name: 'Advanced Tools', icon: Brain },
];

export const PlantFeatures = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'premium': return 'bg-yellow-500';
      case 'coming-soon': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'premium': return 'Premium';
      case 'coming-soon': return 'Coming Soon';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen garden-background">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-30 dark:bg-gray-900/90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  Plant Care Features
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
              🌿 100+ Advanced Plant Care Features
            </CardTitle>
            <CardDescription>
              Discover the most comprehensive plant care ecosystem with over 100 features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search features, descriptions, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="grid w-full grid-cols-5">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    <category.icon className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg dark:bg-green-800">
                        <IconComponent className="h-5 w-5 text-green-600 dark:text-green-300" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {feature.name}
                        </CardTitle>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(feature.status)} text-white text-xs`}
                    >
                      {getStatusText(feature.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-4">
                    {feature.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1">
                    {feature.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {feature.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{feature.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFeatures.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No features found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse different categories
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{features.length}</div>
              <div className="text-sm text-gray-600">Total Features</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {features.filter(f => f.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available Now</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {features.filter(f => f.status === 'premium').length}
              </div>
              <div className="text-sm text-gray-600">Premium Features</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {features.filter(f => f.status === 'coming-soon').length}
              </div>
              <div className="text-sm text-gray-600">Coming Soon</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlantFeatures;