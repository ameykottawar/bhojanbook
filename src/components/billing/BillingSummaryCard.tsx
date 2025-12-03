import { BillingSummary, MEAL_NAMES } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { downloadInvoice } from '@/lib/pdfGenerator';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface BillingSummaryCardProps {
  summary: BillingSummary;
}

export function BillingSummaryCard({ summary }: BillingSummaryCardProps) {
  const monthName = format(new Date(summary.year, parseInt(summary.month) - 1, 1), 'MMMM yyyy');

  const handleDownload = () => {
    downloadInvoice(summary);
    toast.success('Invoice downloaded successfully');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice - ${summary.student.name}`,
          text: `Invoice for ${monthName}: ₹${summary.totalAmount}`,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      toast.info('Sharing is not supported on this device');
    }
  };

  return (
    <Card className="animate-slide-up overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">{summary.student.name}</h2>
        <p className="text-primary-foreground/80">{monthName}</p>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-secondary rounded-lg">
            <p className="text-3xl font-bold text-foreground">{summary.totalMeals}</p>
            <p className="text-sm text-muted-foreground">Total Meals</p>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <p className="text-3xl font-bold text-primary">₹{summary.totalAmount}</p>
            <p className="text-sm text-muted-foreground">Total Amount</p>
          </div>
        </div>

        {/* Meal Breakdown */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Breakdown</h3>
          {(['mini', 'full', 'special'] as const).map((type) => {
            const count = summary.mealCounts[type];
            const total = summary.mealTotals[type];
            if (count === 0) return null;
            
            return (
              <div key={type} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">{MEAL_NAMES[type]}</p>
                  <p className="text-sm text-muted-foreground">{count} meals</p>
                </div>
                <p className="font-semibold text-foreground">₹{total}</p>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleDownload} className="flex-1" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleShare} variant="outline" size="lg">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
