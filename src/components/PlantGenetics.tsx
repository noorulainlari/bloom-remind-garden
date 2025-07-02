
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dna, Microscope, TreePine, Flower, Leaf, Info } from 'lucide-react';

export const PlantGenetics = () => {
  const [selectedPlant, setSelectedPlant] = useState('monstera');
  
  const plantGenetics = {
    monstera: {
      species: 'Monstera deliciosa',
      family: 'Araceae',
      chromosome: 'Diploid (2n = 60)',
      traits: [
        { name: 'Fenestration Development', percentage: 85, genes: ['KNOX1', 'TCP4'] },
        { name: 'Aerial Root Formation', percentage: 92, genes: ['ARF3', 'CRL1'] },
        { name: 'Variegation Pattern', percentage: 15, genes: ['CHM1', 'VAR2'] },
        { name: 'Growth Rate', percentage: 78, genes: ['GA20ox', 'DELLA'] }
      ],
      mutations: ['Variegata', 'Thai Constellation', 'Albo'],
      breeding: {
        difficulty: 'Advanced',
        timeToMaturity: '2-3 years',
        pollination: 'Hand pollination required'
      }
    }
  };

  const currentGenetics = plantGenetics[selectedPlant];

  return (
    <Card className="plant-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Dna className="h-5 w-5" />
          Plant Genetics Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Microscope className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">{currentGenetics.species}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Family:</span> {currentGenetics.family}
            </div>
            <div>
              <span className="font-medium">Chromosome:</span> {currentGenetics.chromosome}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <TreePine className="h-4 w-4 text-green-600" />
            Genetic Traits Analysis
          </h4>
          
          {currentGenetics.traits.map(trait => (
            <div key={trait.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{trait.name}</span>
                <span className="text-sm text-gray-600">{trait.percentage}%</span>
              </div>
              <Progress value={trait.percentage} className="h-2" />
              <div className="flex gap-1">
                {trait.genes.map(gene => (
                  <Badge key={gene} variant="outline" className="text-xs">{gene}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
            <Flower className="h-4 w-4" />
            Known Mutations
          </h4>
          <div className="flex gap-2 flex-wrap">
            {currentGenetics.mutations.map(mutation => (
              <Badge key={mutation} className="bg-purple-100 text-purple-800">{mutation}</Badge>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            Breeding Information
          </h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Difficulty:</span> {currentGenetics.breeding.difficulty}</p>
            <p><span className="font-medium">Time to Maturity:</span> {currentGenetics.breeding.timeToMaturity}</p>
            <p><span className="font-medium">Pollination:</span> {currentGenetics.breeding.pollination}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Microscope className="h-4 w-4 mr-2" />
            DNA Analysis
          </Button>
          <Button size="sm" variant="outline">
            <Info className="h-4 w-4 mr-2" />
            Learn More
          </Button>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-yellow-800 mb-1">🧬 Genetics Facts</p>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Plant DNA is more complex than human DNA</li>
            <li>• Variegation is often caused by genetic mutations</li>
            <li>• Polyploidy can increase plant size and vigor</li>
            <li>• Gene expression changes with environment</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
