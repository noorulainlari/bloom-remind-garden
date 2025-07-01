import { ImprovedPlantSelector } from './ImprovedPlantSelector';

interface PlantSelectorProps {
  onPlantAdded?: () => void;
}

export const PlantSelector = ({ onPlantAdded }: PlantSelectorProps) => {
  return <ImprovedPlantSelector onPlantAdded={onPlantAdded} />;
};
