
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const PlantQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      question: 'How often should you typically water a snake plant?',
      options: ['Daily', 'Every 2-3 days', 'Once a week', 'Every 2-3 weeks'],
      correctAnswer: 3,
      explanation: 'Snake plants are drought-tolerant and prefer to dry out between waterings. Overwatering is more harmful than underwatering.',
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
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
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
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
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
    if (percentage >= 80) return { level: 'Plant Expert', color: 'text-green-600', emoji: '🌟' };
    if (percentage >= 60) return { level: 'Green Thumb', color: 'text-blue-600', emoji: '🌱' };
    if (percentage >= 40) return { level: 'Plant Enthusiast', color: 'text-yellow-600', emoji: '🌿' };
    return { level: 'Plant Beginner', color: 'text-gray-600', emoji: '🌱' };
  };

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
              {score === questions.length ? 'Perfect score! You\'re a true plant expert!' :
               score >= questions.length * 0.8 ? 'Excellent knowledge of plant care!' :
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

          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Brain className="h-5 w-5" />
          Plant Care Quiz
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
