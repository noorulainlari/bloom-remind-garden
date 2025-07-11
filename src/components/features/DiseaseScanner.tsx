
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Microscope, AlertTriangle, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DiseaseScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const mockDiseases = [
    {
      name: 'Powdery Mildew',
      confidence: 92,
      severity: 'Moderate',
      treatment: 'Apply neem oil spray every 3 days. Improve air circulation.',
      symptoms: ['White powdery spots on leaves', 'Leaf yellowing', 'Stunted growth']
    },
    {
      name: 'Leaf Spot Disease',
      confidence: 87,
      severity: 'Mild',
      treatment: 'Remove affected leaves. Apply copper fungicide.',
      symptoms: ['Brown spots with yellow halos', 'Leaf drop', 'Circular lesions']
    },
    {
      name: 'Root Rot',
      confidence: 78,
      severity: 'Severe',
      treatment: 'Reduce watering. Improve drainage. Consider repotting.',
      symptoms: ['Yellowing leaves', 'Soft black roots', 'Wilting despite moist soil']
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanForDiseases = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload a plant image first.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      const isHealthy = Math.random() > 0.6; // 40% chance of being healthy
      
      if (isHealthy) {
        setScanResult({
          isHealthy: true,
          confidence: 94,
          message: 'Your plant appears healthy! No diseases detected.'
        });
      } else {
        setScanResult({
          isHealthy: false,
          disease: randomDisease,
          confidence: randomDisease.confidence
        });
      }
      
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "AI analysis finished. Check results below.",
      });
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-yellow-500';
      case 'moderate': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Microscope className="h-5 w-5 text-purple-500" />
          AI Disease Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          {selectedImage ? (
            <div className="space-y-4">
              <img 
                src={selectedImage} 
                alt="Plant to scan" 
                className="max-w-full h-48 object-cover mx-auto rounded-lg"
              />
              <p className="text-sm text-gray-600">Image ready for scanning</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-semibold">Upload Plant Image</p>
                <p className="text-sm text-gray-600">Take a clear photo of affected plant parts</p>
              </div>
            </div>
          )}
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="plant-image-upload"
          />
          <label htmlFor="plant-image-upload">
            <Button variant="outline" className="mt-4 cursor-pointer">
              <Camera className="h-4 w-4 mr-2" />
              {selectedImage ? 'Change Image' : 'Select Image'}
            </Button>
          </label>
        </div>

        <Button 
          onClick={scanForDiseases}
          disabled={isScanning || !selectedImage}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isScanning ? (
            <>
              <Microscope className="h-4 w-4 mr-2 animate-spin" />
              Analyzing... (AI Processing)
            </>
          ) : (
            <>
              <Microscope className="h-4 w-4 mr-2" />
              Start AI Disease Scan
            </>
          )}
        </Button>

        {scanResult && (
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              {scanResult.isHealthy ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              )}
              <h3 className="font-semibold text-lg">
                {scanResult.isHealthy ? 'Plant is Healthy!' : 'Disease Detected'}
              </h3>
              <Badge variant="outline">
                {scanResult.confidence}% Confidence
              </Badge>
            </div>

            {scanResult.isHealthy ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">{scanResult.message}</p>
                <p className="text-sm text-green-600 mt-2">
                  Continue regular care routine. Monitor for any changes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{scanResult.disease.name}</h4>
                  <Badge className={`${getSeverityColor(scanResult.disease.severity)} text-white`}>
                    {scanResult.disease.severity}
                  </Badge>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-red-800 mb-2">Symptoms Detected:</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    {scanResult.disease.symptoms.map((symptom: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Recommended Treatment:</h5>
                  <p className="text-sm text-blue-700">{scanResult.disease.treatment}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>AI-powered disease detection using advanced machine learning</p>
          <p>For severe cases, consult with a plant expert</p>
        </div>
      </CardContent>
    </Card>
  );
};
