
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Lightbulb, Target, BarChart3, Zap } from 'lucide-react';

export const PlantInsights = () => {
  const [selectedCategory, setSelectedCategory] = useState('performance');
  
  const insights = {
    performance: {
      title: 'Performance Analytics',
      data: [
        {
          metric: 'Growth Rate',
          value: '+23%',
          trend: 'up',
          insight: 'Your plants are growing 23% faster than average due to consistent care schedule.',
          recommendation: 'Continue current watering and fertilization routine.'
        },
        {
          metric: 'Health Score',
          value: '87%',
          trend: 'up',
          insight: 'Overall plant health has improved by 12% over the last month.',
          recommendation: 'Focus on humidity levels to reach 90%+ health score.'
        },
        {
          metric: 'Care Consistency',
          value: '94%',
          trend: 'stable',
          insight: 'Excellent care consistency! You rarely miss watering schedules.',
          recommendation: 'You\'re doing great - maintain this routine.'
        }
      ]
    },
    patterns: {
      title: 'Care Patterns',
      data: [
        {
          metric: 'Best Care Day',
          value: 'Monday',
          trend: 'neutral',
          insight: 'You provide the most comprehensive care on Mondays.',
          recommendation: 'Consider spreading intensive care tasks throughout the week.'
        },
        {
          metric: 'Problem Detection',
          value: '2.3 days',
          trend: 'up',
          insight: 'You\'re getting faster at identifying plant issues.',
          recommendation: 'Daily quick visual checks could reduce this to 1 day.'
        },
        {
          metric: 'Seasonal Adaptation',
          value: 'Excellent',
          trend: 'up',
          insight: 'You adjust care routines well for seasonal changes.',
          recommendation: 'Share your knowledge with the plant community!'
        }
      ]
    },
    predictions: {
      title: 'Growth Predictions',
      data: [
        {
          metric: 'Next Growth Spurt',
          value: '7-10 days',
          trend: 'up',
          insight: 'Based on current conditions, expect new growth soon.',
          recommendation: 'Increase fertilizer slightly to support upcoming growth.'
        },
        {
          metric: 'Repotting Needed',
          value: '3 months',
          trend: 'neutral',
          insight: 'Your Monstera will likely need repotting in 3 months.',
          recommendation: 'Start monitoring root growth through drainage holes.'
        },
        {
          metric: 'Flowering Chance',
          value: '85%',
          trend: 'up',
          insight: 'Your Peace Lily has high probability of flowering soon.',
          recommendation: 'Maintain consistent moisture and increase phosphorus.'
        }
      ]
    }
  };

  const categories = Object.keys(insights);
  const currentData = insights[selectedCategory];

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Brain className="h-5 w-5" />
          AI Plant Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {insights[category].title.split(' ')[0]}
            </Button>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">{currentData.title}</h3>
          <p className="text-sm text-gray-600">
            AI-powered analysis of your plant care patterns and predictions
          </p>
        </div>

        <div className="space-y-3">
          {currentData.data.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">{item.metric}</h4>
                <div className="flex items-center gap-2">
                  {getTrendIcon(item.trend)}
                  <span className={`font-bold ${getTrendColor(item.trend)}`}>
                    {item.value}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-800">Insight</span>
                  </div>
                  <p className="text-xs text-blue-700">{item.insight}</p>
                </div>
                
                <div className="bg-green-50 p-2 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-800">Recommendation</span>
                  </div>
                  <p className="text-xs text-green-700">{item.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Zap className="h-4 w-4 mr-2" />
            Get More Insights
          </Button>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-orange-800 mb-1">🧠 AI Tip</p>
          <p className="text-xs text-orange-700">
            The more data you provide about your plants, the more accurate and personalized these insights become!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
