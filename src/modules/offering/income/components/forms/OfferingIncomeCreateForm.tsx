import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { cn } from '@/shared/lib/utils';

import { OfferingIncomeFormFields, ReceiptPreviewModal } from '@/modules/offering/income/components';
import { useOfferingIncomeForm } from '@/modules/offering/income/hooks/forms/useOfferingIncomeForm';

interface OfferingIncomeCreateFormProps {
  className?: string;
}

export const OfferingIncomeCreateForm = ({
  className,
}: OfferingIncomeCreateFormProps): JSX.Element => {
  const navigate = useNavigate();
  const {
    mode,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    receiptPdfBlob,
    receiptOfferingId,
    ...hookReturn
  } = useOfferingIncomeForm({ mode: 'create' });

  const handleReceiptModalClose = useCallback(
    (open: boolean) => {
      setIsReceiptModalOpen(open);
      if (!open) {
        // Navigate to offerings list after closing modal
        setTimeout(() => {
          navigate('/offerings/income');
        }, 300);
      }
    },
    [navigate, setIsReceiptModalOpen]
  );

  return (
    <>
      <div className={cn('w-full max-w-[1220px] mx-auto', className)}>
        <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
          <OfferingIncomeFormFields mode='create' {...hookReturn} />
        </div>
      </div>

      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        open={isReceiptModalOpen}
        onOpenChange={handleReceiptModalClose}
        pdfBlob={receiptPdfBlob}
        offeringId={receiptOfferingId}
      />
    </>
  );
};
