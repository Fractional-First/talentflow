import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { useAgreementStatus } from '@/hooks/useAgreementStatus';
import { AGREEMENT_CONTENT } from '@/content/agreementContent';
import { format } from 'date-fns';

export function AccuracyWarrantBanner() {
  const { isWarrantAgreed, warrantAgreedAt, acceptWarrant, isSubmitting } = useAgreementStatus();

  const handleChange = async (checked: boolean) => {
    if (checked && !isWarrantAgreed) {
      await acceptWarrant();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <div className={`rounded-lg p-4 mb-6 border ${
      isWarrantAgreed 
        ? 'bg-green-50 border-green-200' 
        : 'bg-amber-50 border-amber-200'
    }`}>
      <div className="flex items-start gap-3">
        {isWarrantAgreed ? (
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <Checkbox 
            id="accuracy-warrant"
            checked={isWarrantAgreed}
            onCheckedChange={handleChange}
            disabled={isWarrantAgreed || isSubmitting}
            className="mt-0.5"
          />
        )}
        <div className="flex-1">
          <Label 
            htmlFor="accuracy-warrant"
            className={`text-sm cursor-pointer ${
              isWarrantAgreed ? 'text-green-900' : 'text-amber-900'
            }`}
          >
            {isWarrantAgreed 
              ? AGREEMENT_CONTENT.accuracyWarrant.confirmedLabel
              : AGREEMENT_CONTENT.accuracyWarrant.label
            }
          </Label>
          {isWarrantAgreed && warrantAgreedAt && (
            <p className="text-xs text-green-700 mt-1">
              Confirmed on {formatDate(warrantAgreedAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
