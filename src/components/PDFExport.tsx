
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { format } from 'date-fns';

interface Plant {
  id: string;
  plant_name: string;
  scientific_name: string;
  watering_interval_days: number;
  last_watered: string;
  next_water_date: string;
  custom_name?: string;
}

interface PDFExportProps {
  plants: Plant[];
  className?: string;
}

export const PDFExport = ({ plants, className = '' }: PDFExportProps) => {
  const generatePDF = () => {
    if (plants.length === 0) {
      alert('No plants to export');
      return;
    }

    // Create a new window for the PDF content
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>My Plant Watering Schedule</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
              color: #166534;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              background: white;
              border-radius: 15px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header h1 {
              color: #15803d;
              font-size: 28px;
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .header p {
              color: #16a34a;
              margin: 10px 0 0 0;
              font-size: 14px;
            }
            .plant-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .plant-card {
              background: white;
              border-radius: 15px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              border: 2px solid #bbf7d0;
            }
            .plant-name {
              font-size: 18px;
              font-weight: bold;
              color: #15803d;
              margin-bottom: 5px;
            }
            .scientific-name {
              font-style: italic;
              color: #16a34a;
              font-size: 14px;
              margin-bottom: 15px;
            }
            .schedule-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              padding: 10px;
              background: #f0fdf4;
              border-radius: 8px;
              border-left: 4px solid #22c55e;
            }
            .info-label {
              font-weight: bold;
              color: #15803d;
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .info-value {
              color: #166534;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background: white;
              border-radius: 15px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              margin-top: 20px;
            }
            .emoji {
              font-size: 24px;
            }
            @media print {
              body { background: white; }
              .plant-card { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1><span class="emoji">🌱</span> My Plant Watering Schedule</h1>
            <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')} • Total Plants: ${plants.length}</p>
          </div>
          
          <div class="plant-grid">
            ${plants.map(plant => `
              <div class="plant-card">
                <div class="plant-name">
                  ${getPlantEmoji(plant.plant_name)} ${plant.custom_name || plant.plant_name}
                </div>
                ${plant.scientific_name ? `<div class="scientific-name">${plant.scientific_name}</div>` : ''}
                
                <div class="schedule-info">
                  <div class="info-item">
                    <div class="info-label">💧 Watering Frequency</div>
                    <div class="info-value">Every ${plant.watering_interval_days} day${plant.watering_interval_days === 1 ? '' : 's'}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">📅 Last Watered</div>
                    <div class="info-value">${format(new Date(plant.last_watered), 'MMM dd, yyyy')}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">🗓️ Next Watering</div>
                    <div class="info-value">${format(new Date(plant.next_water_date), 'MMM dd, yyyy')}</div>
                  </div>
                  
                  <div class="info-item">
                    <div class="info-label">📊 Status</div>
                    <div class="info-value">${getWateringStatus(plant.next_water_date)}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="footer">
            <p style="color: #16a34a; margin: 0;">
              🌿 Generated by Plant Watering Reminder Tool<br>
              Keep your plants healthy and happy! 🌱
            </p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const getPlantEmoji = (plantName: string) => {
    const name = plantName.toLowerCase();
    if (name.includes('cactus')) return '🌵';
    if (name.includes('rose')) return '🌹';
    if (name.includes('succulent')) return '🪴';
    if (name.includes('herb') || name.includes('basil') || name.includes('mint')) return '🌿';
    if (name.includes('tree') || name.includes('ficus')) return '🌳';
    if (name.includes('flower')) return '🌸';
    if (name.includes('lily')) return '🌺';
    return '🌱';
  };

  const getWateringStatus = (nextWaterDate: string) => {
    const today = new Date();
    const waterDate = new Date(nextWaterDate);
    const diffTime = waterDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '🚨 Overdue';
    if (diffDays === 0) return '💧 Due Today';
    if (diffDays <= 2) return '⚠️ Due Soon';
    return '✅ Healthy';
  };

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      className={`border-green-300 hover:bg-green-50 ${className}`}
    >
      <FileDown className="h-4 w-4 mr-2" />
      Export PDF Schedule
    </Button>
  );
};
