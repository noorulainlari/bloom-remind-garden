
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Plant {
  id: string;
  plant_name: string;
  scientific_name?: string;
  watering_interval_days: number;
}

export const PlantQuiz = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const questions: Question[] = [
    {
      id: '1',
      question: 'How often should you typically water most houseplants?',
      options: ['Daily', 'Every 2-3 days', 'Once a week', 'When soil is dry'],
      correctAnswer: 3,
      explanation: 'Most houseplants should be watered when the top inch of soil feels dry to prevent overwatering.',
      difficulty: 'easy'
    },
    {
      id: '2',
      question: 'What does it mean when a plant\'s leaves turn yellow?',
      options: ['Too much sunlight', 'Overwatering', 'Natural aging', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Yellow leaves can indicate various issues including overwatering, too much direct sunlight, or natural aging of older leaves.',
      difficulty: 'medium'
    },
    {
      id: '3',
      question: 'Which nutrient deficiency commonly causes yellowing between leaf veins?',
      options: ['Nitrogen', 'Iron', 'Phosphorus', 'Potassium'],
      correctAnswer: 1,
      explanation: 'Iron deficiency typically causes interveinal chlorosis - yellowing between the veins while veins remain green.',
      difficulty: 'hard'
    },
    {
      id: '4',
      question: 'What is the best time of day to water most houseplants?',
      options: ['Early morning', 'Midday', 'Late afternoon', 'Night'],
      correctAnswer: 0,
      explanation: 'Early morning watering allows plants to absorb water before the heat of the day and reduces risk of fungal issues.',
      difficulty: 'easy'
    },
    {
      id: '5',
      question: 'Which of these is NOT a sign of overwatering?',
      options: ['Musty soil smell', 'Yellow leaves', 'Dry, crispy leaf edges', 'Soft, black roots'],
      correctAnswer: 2,
      explanation: 'Dry, crispy leaf edges typically indicate underwatering or low humidity, not overwatering.',
      difficulty: 'medium'
    },
    {
      id: '6',
      question: 'What does NPK stand for in fertilizers?',
      options: ['Nitrogen, Phosphorus, Potassium', 'Nutrients, Phosphates, Kalium', 'Natural Plant Killer', 'New Plant Knowledge'],
      correctAnswer: 0,
      explanation: 'NPK represents the three primary macronutrients: Nitrogen (N), Phosphorus (P), and Potassium (K).',
      difficulty: 'medium'
    },
    {
      id: '7',
      question: 'How much light do most succulents need?',
      options: ['Low light', 'Medium light', 'Bright, indirect light', 'Direct sunlight for 8+ hours'],
      correctAnswer: 2,
      explanation: 'Most succulents thrive in bright, indirect light. Too much direct sun can scorch their leaves.',
      difficulty: 'easy'
    },
    {
      id: '8',
      question: 'What is the ideal humidity level for most tropical houseplants?',
      options: ['20-30%', '40-60%', '70-80%', '90-100%'],
      correctAnswer: 1,
      explanation: 'Most tropical houseplants prefer humidity levels between 40-60%, which mimics their natural habitat.',
      difficulty: 'medium'
    },
    {
      id: '9',
      question: 'When should you repot a plant?',
      options: ['Every month', 'When roots grow out of drainage holes', 'Never', 'Only when it dies'],
      correctAnswer: 1,
      explanation: 'Plants should be repotted when they become root-bound, typically indicated by roots growing out of drainage holes.',
      difficulty: 'easy'
    },
    {
      id: '10',
      question: 'What causes brown tips on plant leaves?',
      options: ['Too much water', 'Low humidity', 'Fluoride in water', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Brown leaf tips can be caused by overwatering, low humidity, fluoride/chlorine in tap water, or fertilizer burn.',
      difficulty: 'medium'
    },
    {
      id: '11',
      question: 'Which type of water is best for most houseplants?',
      options: ['Tap water', 'Distilled water', 'Rainwater', 'Salt water'],
      correctAnswer: 2,
      explanation: 'Rainwater is ideal as it\'s naturally soft and free from chemicals like chlorine and fluoride found in tap water.',
      difficulty: 'medium'
    },
    {
      id: '12',
      question: 'What does it mean when plant leaves droop?',
      options: ['Always overwatering', 'Always underwatering', 'Could be either over or underwatering', 'Plant is happy'],
      correctAnswer: 2,
      explanation: 'Drooping leaves can indicate both overwatering and underwatering. Check soil moisture to determine the cause.',
      difficulty: 'hard'
    },
    {
      id: '13',
      question: 'How often should you fertilize houseplants during growing season?',
      options: ['Daily', 'Weekly', 'Monthly', 'Never'],
      correctAnswer: 2,
      explanation: 'Most houseplants benefit from monthly fertilization during the growing season (spring and summer).',
      difficulty: 'easy'
    },
    {
      id: '14',
      question: 'What is etiolation in plants?',
      options: ['Root rot', 'Stretching toward light', 'Flower blooming', 'Leaf dropping'],
      correctAnswer: 1,
      explanation: 'Etiolation is when plants stretch and become leggy due to insufficient light as they reach toward light sources.',
      difficulty: 'hard'
    },
    {
      id: '15',
      question: 'Which plants are toxic to pets?',
      options: ['Pothos', 'Peace lily', 'Philodendron', 'All of the above'],
      correctAnswer: 3,
      explanation: 'Many common houseplants including pothos, peace lilies, and philodendrons are toxic to cats and dogs.',
      difficulty: 'medium'
    },
    {
      id: '16',
      question: 'What causes white powdery substance on plant leaves?',
      options: ['Dust', 'Powdery mildew', 'Spider mites', 'Natural plant coating'],
      correctAnswer: 1,
      explanation: 'White powdery substance is usually powdery mildew, a fungal infection caused by poor air circulation and high humidity.',
      difficulty: 'medium'
    },
    {
      id: '17',
      question: 'When is the best time to prune most houseplants?',
      options: ['Winter', 'Spring', 'Summer', 'Fall'],
      correctAnswer: 1,
      explanation: 'Spring is the best time to prune as plants enter their active growing season and can recover quickly.',
      difficulty: 'easy'
    },
    {
      id: '18',
      question: 'What does dormancy mean for houseplants?',
      options: ['Plant death', 'Slow growth period', 'Flowering time', 'Repotting time'],
      correctAnswer: 1,
      explanation: 'Dormancy is a natural slow growth period, usually in winter, when plants conserve energy and require less water and fertilizer.',
      difficulty: 'medium'
    },
    {
      id: '19',
      question: 'How can you increase humidity around plants?',
      options: ['Use a humidifier', 'Group plants together', 'Place on pebble trays', 'All of the above'],
      correctAnswer: 3,
      explanation: 'All these methods effectively increase humidity: humidifiers, grouping plants, and pebble trays with water.',
      difficulty: 'easy'
    },
    {
      id: '20',
      question: 'What is the purpose of drainage holes in pots?',
      options: ['Decoration', 'Prevent root rot', 'Make pots lighter', 'Air circulation'],
      correctAnswer: 1,
      explanation: 'Drainage holes prevent water from sitting in the pot, which can cause root rot and other water-related problems.',
      difficulty: 'easy'
    }
  ];

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      const { data, error } = await supabase
        .from('plant_species')
        .select('id, name, scientific_name, watering_interval_days')
        .order('name');

      if (error) {
        console.error('Error loading plants:', error);
      } else {
        const formattedPlants: Plant[] = (data || []).map(plant => ({
          id: plant.id,
          plant_name: plant.name,
          scientific_name: plant.scientific_name,
          watering_interval_days: plant.watering_interval_days
        }));
        setPlants(formattedPlants);
      }
    } catch (error) {
      console.error('Error loading plants:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (selectedPlant) {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setScore(0);
      setUserAnswers([]);
      setQuizComplete(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setSelectedPlant(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setUserAnswers([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreLevel = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return { level: 'Plant Master', color: 'text-green-600', emoji: '🌟' };
    if (percentage >= 80) return { level: 'Plant Expert', color: 'text-green-600', emoji: '🌱' };
    if (percentage >= 70) return { level: 'Green Thumb', color: 'text-blue-600', emoji: '🌿' };
    if (percentage >= 60) return { level: 'Plant Enthusiast', color: 'text-yellow-600', emoji: '🍃' };
    if (percentage >= 50) return { level: 'Growing Gardener', color: 'text-orange-600', emoji: '🌾' };
    return { level: 'Plant Beginner', color: 'text-gray-600', emoji: '🌱' };
  };

  if (loading) {
    return (
      <Card className="plant-card">
        <CardContent className="p-6 text-center">
          <div className="text-green-600">Loading plant quiz...</div>
        </CardContent>
      </Card>
    );
  }

  if (!quizStarted) {
    return (
      <Card className="plant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Brain className="h-5 w-5" />
            Plant Care Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-600 mb-4">
              Test your plant care knowledge with our comprehensive 20-question quiz! 
              First, select a plant from our database to personalize your experience.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a Plant Species:
                </label>
                <Select onValueChange={(value) => {
                  const plant = plants.find(p => p.id === value);
                  setSelectedPlant(plant || null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a plant species..." />
                  </SelectTrigger>
                  <SelectContent>
                    {plants.map((plant) => (
                      <SelectItem key={plant.id} value={plant.id}>
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span>{plant.plant_name}</span>
                          {plant.scientific_name && (
                            <span className="text-sm text-gray-500 italic">
                              ({plant.scientific_name})
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlant && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800 mb-2">Selected Plant:</h3>
                  <p className="text-green-700">
                    <strong>{selectedPlant.plant_name}</strong>
                    {selectedPlant.scientific_name && (
                      <span className="italic"> ({selectedPlant.scientific_name})</span>
                    )}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Watering interval: Every {selectedPlant.watering_interval_days} days
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">20</div>
                  <div className="text-xs text-blue-600">Questions</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">3</div>
                  <div className="text-xs text-green-600">Difficulty Levels</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-700">5</div>
                  <div className="text-xs text-purple-600">Minutes</div>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={startQuiz} 
            className="w-full" 
            disabled={!selectedPlant}
          >
            <Brain className="h-4 w-4 mr-2" />
            Start Plant Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (quizComplete) {
    const scoreLevel = getScoreLevel(score, questions.length);
    return (
      <Card className="plant-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Trophy className="h-5 w-5" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl">{scoreLevel.emoji}</div>
          <div>
            <h3 className={`text-2xl font-bold ${scoreLevel.color}`}>{scoreLevel.level}</h3>
            <p className="text-lg text-gray-700">
              You scored {score} out of {questions.length}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Quiz based on: <strong>{selectedPlant?.plant_name}</strong>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {score === questions.length ? 'Perfect score! You\'re a true plant expert!' :
               score >= questions.length * 0.9 ? 'Outstanding! You have excellent plant knowledge!' :
               score >= questions.length * 0.8 ? 'Excellent knowledge of plant care!' :
               score >= questions.length * 0.7 ? 'Great job! You know your plants well!' :
               score >= questions.length * 0.6 ? 'Good job! Keep learning about plants!' :
               'Keep practicing! Every plant parent started somewhere.'}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{score}</div>
              <div className="text-xs text-green-600">Correct</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{questions.length - score}</div>
              <div className="text-xs text-red-600">Incorrect</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{Math.round((score/questions.length)*100)}%</div>
              <div className="text-xs text-blue-600">Score</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">Quick Review:</h4>
            <div className="text-left space-y-1 max-h-40 overflow-y-auto">
              {questions.map((question, index) => (
                <div key={question.id} className="flex items-center gap-2 text-sm">
                  {userAnswers[index] === question.correctAnswer ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="truncate">Q{index + 1}: {question.question.substring(0, 50)}...</span>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Brain className="h-5 w-5" />
          Plant Care Quiz - {selectedPlant?.plant_name}
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <Badge className={getDifficultyColor(current.difficulty)}>
              {current.difficulty}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {current.question}
          </h3>
          
          <div className="space-y-2">
            {current.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? 
                  (showResult ? 
                    (index === current.correctAnswer ? 'default' : 'destructive') 
                    : 'default'
                  ) : 'outline'
                }
                className="w-full text-left justify-start h-auto p-3"
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <div className="flex items-center gap-2">
                  {showResult && index === current.correctAnswer && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                  {showResult && selectedAnswer === index && index !== current.correctAnswer && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{option}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {showResult && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
            <p className="text-sm text-blue-700">{current.explanation}</p>
          </div>
        )}

        {showResult && (
          <Button onClick={nextQuestion} className="w-full">
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
          </Button>
        )}

        <div className="text-center text-sm text-gray-500">
          Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
        </div>
      </CardContent>
    </Card>
  );
};
