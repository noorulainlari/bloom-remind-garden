
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, Camera, Zap, Brain } from 'lucide-react';

interface AIResponse {
  id: string;
  question: string;
  answer: string;
  confidence: number;
  timestamp: string;
}

export const PlantAI = () => {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState<AIResponse[]>([
    {
      id: '1',
      question: 'Why are my plant leaves turning yellow?',
      answer: 'Yellow leaves can indicate several issues: overwatering (most common), nutrient deficiency, or natural aging. Check soil moisture and reduce watering if soggy. Consider fertilizing if leaves are uniformly yellow.',
      confidence: 92,
      timestamp: '2 hours ago'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const predefinedQuestions = [
    'How often should I water my plants?',
    'What are signs of overwatering?',
    'Best plants for low light?',
    'How to propagate succulent?',
    'Natural pest control methods?'
  ];

  const generateAIResponse = (userQuestion: string): string => {
    const responses = [
      `For "${userQuestion}" - Based on plant care principles, I recommend checking soil moisture, ensuring proper drainage, and monitoring light conditions. Most plant issues stem from watering problems.`,
      `Great question about "${userQuestion}"! This typically depends on your plant species, environment, and season. I suggest observing your plant's specific needs and adjusting care accordingly.`,
      `Regarding "${userQuestion}" - This is a common concern among plant parents. The key is understanding your plant's natural habitat and replicating those conditions as closely as possible.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const askAI = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const response: AIResponse = {
        id: Date.now().toString(),
        question: question,
        answer: generateAIResponse(question),
        confidence: Math.floor(Math.random() * 20) + 80,
        timestamp: 'Just now'
      };
      
      setResponses([response, ...responses]);
      setQuestion('');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Bot className="h-5 w-5" />
          Plant AI Assistant
        </CardTitle>
        <p className="text-sm text-gray-600">Get instant plant care advice powered by AI</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your plant care concerns..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askAI()}
              disabled={isLoading}
            />
            <Button onClick={askAI} disabled={isLoading || !question.trim()}>
              {isLoading ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex gap-1 flex-wrap">
            {predefinedQuestions.slice(0, 3).map((q, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setQuestion(q)}
                className="text-xs"
              >
                {q}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {responses.map(response => (
            <div key={response.id} className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <div className="flex items-start gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-blue-800 text-sm mb-1">{response.question}</p>
                  <p className="text-sm text-gray-700">{response.answer}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {response.confidence}% confidence
                </Badge>
                <span className="text-xs text-gray-500">{response.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Pro Tip</span>
          </div>
          <p className="text-xs text-yellow-700">
            Upload photos of your plants for more accurate AI diagnosis and personalized care recommendations!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
