import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Lock, 
  FileText, 
  Download, 
  Eye,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface AgreementCardProps {
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'locked';
  completedAt?: string;
  onView?: () => void;
  onSign?: () => void;
  lockedMessage?: string;
}

export function AgreementCard({ 
  title, 
  description, 
  status, 
  completedAt,
  onView,
  onSign,
  lockedMessage = 'Available when matched with an opportunity'
}: AgreementCardProps) {
  const handleDownload = () => {
    toast.info('PDF download will be available in production');
  };

  const formattedDate = completedAt 
    ? new Date(completedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      })
    : null;

  return (
    <Card className={status === 'locked' ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-2 rounded-full flex-shrink-0 ${
            status === 'completed' ? 'bg-green-100' : 
            status === 'locked' ? 'bg-muted' : 'bg-primary/10'
          }`}>
            {status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : status === 'locked' ? (
              <Lock className="h-5 w-5 text-muted-foreground" />
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-sm">{title}</h3>
              {status === 'completed' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                  Signed
                </Badge>
              )}
              {status === 'pending' && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                  Pending
                </Badge>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              {status === 'locked' ? lockedMessage : description}
            </p>

            {status === 'completed' && formattedDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="h-3 w-3" />
                <span>Signed on {formattedDate}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {status === 'completed' && (
                <>
                  {onView && (
                    <Button variant="outline" size="sm" onClick={onView}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </>
              )}
              {status === 'pending' && onSign && (
                <Button size="sm" onClick={onSign}>
                  Sign Now
                </Button>
              )}
              {status === 'locked' && onSign && (
                <Button variant="outline" size="sm" onClick={onSign}>
                  Sign Early (Optional)
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
