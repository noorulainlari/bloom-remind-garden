
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

const GARDEN_QUOTES = [
  "A garden requires patient labor and attention. Plants and children respond to care but thrive on love. 🌱",
  "The earth laughs in flowers, but it whispers through the leaves of well-tended plants. 🍃",
  "Gardening is the art that uses flowers and plants as paint, and the soil and sky as canvas. 🎨",
  "To plant a garden is to believe in tomorrow, one watering at a time. 🌿",
  "The best time to plant a tree was 20 years ago. The second best time is now. 🌳",
  "In every gardener there is a child who believes in the seed fairy. ✨",
  "A society grows great when old men plant trees whose shade they know they shall never sit in. 🌲",
  "The glory of gardening: hands in the dirt, head in the sun, heart with nature. ☀️",
  "Gardens require patient labor and attention. But the reward is a lifetime of beauty. 🌺",
  "Where flowers bloom, so does hope. Water them well and watch magic happen. 🌸"
];

const GARDEN_TIPS = [
  "💡 Tip: Water your plants in the morning to reduce evaporation and prevent fungal diseases.",
  "💡 Tip: Check soil moisture by inserting your finger 1-2 inches deep before watering.",
  "💡 Tip: Group plants with similar watering needs together for easier care.",
  "💡 Tip: Yellow leaves often indicate overwatering, while brown crispy leaves suggest underwatering.",
  "💡 Tip: Use room temperature water for your plants - cold water can shock their roots.",
  "💡 Tip: Most houseplants prefer bright, indirect light rather than direct sunlight.",
  "💡 Tip: Rotate your plants weekly so all sides get equal light exposure.",
  "💡 Tip: Mist tropical plants to increase humidity, but avoid fuzzy-leaved plants.",
  "💡 Tip: Feed your plants during growing season (spring/summer) but ease up in winter.",
  "💡 Tip: Clean plant leaves with a damp cloth to help them photosynthesize better."
];

export const GardenQuote = () => {
  const [currentContent, setCurrentContent] = useState('');
  const [isQuote, setIsQuote] = useState(true);

  useEffect(() => {
    const updateContent = () => {
      const useQuote = Math.random() > 0.5;
      const content = useQuote 
        ? GARDEN_QUOTES[Math.floor(Math.random() * GARDEN_QUOTES.length)]
        : GARDEN_TIPS[Math.floor(Math.random() * GARDEN_TIPS.length)];
      
      setCurrentContent(content);
      setIsQuote(useQuote);
    };

    updateContent();
    const interval = setInterval(updateContent, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="h-5 w-5 text-green-600 animate-leaf-sway" />
          <span className="text-sm font-semibold text-green-800">
            {isQuote ? "Garden Wisdom" : "Care Tip"}
          </span>
          <Leaf className="h-5 w-5 text-green-600 animate-leaf-sway" />
        </div>
        <p className="text-green-700 text-sm italic leading-relaxed transition-all duration-500">
          {currentContent}
        </p>
      </CardContent>
    </Card>
  );
};
