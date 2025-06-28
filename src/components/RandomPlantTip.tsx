
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, RefreshCw } from 'lucide-react';

const PLANT_TIPS = [
  "💡 Most houseplants prefer bright, indirect light rather than direct sunlight.",
  "🌱 Check soil moisture by sticking your finger 1-2 inches deep into the soil.",
  "💧 Yellow leaves often indicate overwatering, while brown crispy leaves suggest underwatering.",
  "🌿 Rotate your plants weekly to ensure even growth on all sides.",
  "🪴 Use pots with drainage holes to prevent root rot from standing water.",
  "🌸 Most plants need less water in winter when their growth slows down.",
  "🍃 Mist tropical plants to increase humidity, especially during dry seasons.",
  "🌵 Succulents and cacti need well-draining soil and infrequent watering.",
  "🌺 Remove dead or yellowing leaves to help your plant focus energy on healthy growth.",
  "🌳 Repot plants when roots start growing out of drainage holes or circling the pot.",
  "💨 Good air circulation helps prevent fungal diseases and pest infestations.",
  "🌞 South-facing windows provide the most light, while north-facing provide the least.",
  "🧪 Use room-temperature water for watering - cold water can shock plant roots.",
  "🐛 Inspect plants regularly for pests like spider mites, aphids, and scale insects.",
  "🍂 Brown leaf tips often indicate low humidity or too much fertilizer.",
  "⏰ Water plants in the morning so they can absorb moisture throughout the day.",
  "🌿 Group plants together to create a humid microclimate they'll love.",
  "🪨 Add pebbles to plant saucers for extra humidity without waterlogged roots.",
  "📏 Most plants prefer to dry out slightly between waterings.",
  "🌡️ Keep plants away from heating vents and air conditioning units.",
  "🌱 Fertilize during growing season (spring/summer) but reduce in fall/winter.",
  "🔄 Pruning encourages bushier growth and removes diseased or damaged parts.",
  "🌊 Bottom watering ensures roots get moisture without wetting leaves.",
  "🏠 Quarantine new plants for 2 weeks to prevent spreading pests to other plants.",
  "🌈 Variegated plants need more light to maintain their colorful patterns."
];

export const RandomPlantTip = () => {
  const [currentTip, setCurrentTip] = useState('');

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * PLANT_TIPS.length);
    setCurrentTip(PLANT_TIPS[randomIndex]);
  };

  useEffect(() => {
    getRandomTip();
  }, []);

  return (
    <Card className="plant-card shadow-lg bg-gradient-to-r from-emerald-50 to-green-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Plant Care Tip
          </div>
          <Button
            onClick={getRandomTip}
            variant="ghost"
            size="sm"
            className="text-green-600 hover:text-green-800"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-green-700 leading-relaxed font-medium">
          {currentTip}
        </p>
      </CardContent>
    </Card>
  );
};
