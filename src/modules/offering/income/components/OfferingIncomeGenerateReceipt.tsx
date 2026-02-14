import { useState, useCallback } from 'react';

import { Printer, Loader2, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { cn } from '@/shared/lib/utils';

import { generateReceiptByOfferingIncomeId } from '@/modules/offering/income/services/offering-income.service';
import { ReceiptPreviewModal } from '@/modules/offering/income/components/forms/ReceiptPreviewModal';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';

interface OfferingIncomeInfoCardProps {
  idRow: string;
}

export const OfferingIncomeGenerateReceipt = ({
  idRow,
}: OfferingIncomeInfoCardProps): JSX.Element => {
  //* States
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  //* Query Report and Event trigger
  const generateReportQuery = useQuery({
    queryKey: ['offering-income-generate-receipt', idRow],
    queryFn: async () => {
      const response = await generateReceiptByOfferingIncomeId({
        id: idRow,
        shouldOpenReceiptInBrowser: 'no',
        generationType: 'with-qr',
      });
      return response;
    },
    retry: false,
    enabled: false,
  });

  const handleGenerateReport = (): void => {
    setIsLoadingModalOpen(true);
    generateReportQuery.refetch().then((result) => {
      if (result.data?.data) {
        setPdfBlob(result.data.data);
        setIsLoadingModalOpen(false);
        setIsPreviewModalOpen(true);
      }
    });
  };

  const handlePreviewModalClose = useCallback((open: boolean) => {
    setIsPreviewModalOpen(open);
    if (!open) {
      setPdfBlob(null);
    }
  }, []);

  return (
    <>
      <Dialog open={isLoadingModalOpen} onOpenChange={setIsLoadingModalOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={handleGenerateReport}
            variant='ghost'
            className={cn(
              'h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20 transition-colors'
            )}
          >
            <Printer className='h-4 w-4' />
          </Button>
        </DialogTrigger>

        <DialogContent className='max-w-[380px] sm:max-w-[440px] w-full p-0 gap-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'>
          {/* Header con gradiente */}
          <div className='relative overflow-hidden rounded-t-lg bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-teal-900 px-6 py-5'>
            <div className='flex items-center gap-3'>
              <div className='p-2.5 bg-white/10 rounded-lg'>
                <FileText className='w-6 h-6 text-white/90' />
              </div>
              <div className='flex-1 min-w-0'>
                <DialogTitle className='text-lg font-bold text-white font-outfit mb-0.5'>
                  Generando recibo
                </DialogTitle>
                <DialogDescription className='text-emerald-100/80 text-[13px] font-inter'>
                  Procesando documento
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className='flex flex-col items-center justify-center gap-6 py-8 px-6'>
            <div className='relative'>
              {/* Circle background animado */}
              <div className='absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-900/30 animate-pulse' />
              <div className='relative p-4'>
                <Loader2 className='w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-spin' />
              </div>
            </div>

            <div className='text-center space-y-2'>
              <p className='text-base font-medium text-slate-700 dark:text-slate-200 font-inter'>
                Por favor, espere...
              </p>
              <p className='text-[13px] text-slate-500 dark:text-slate-400 font-inter'>
                Estamos generando su recibo de ofrenda
              </p>
            </div>

            {/* Progress indicator */}
            <div className='w-full max-w-[200px] h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
              <div className='h-full w-2/3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse' />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        open={isPreviewModalOpen}
        onOpenChange={handlePreviewModalClose}
        pdfBlob={pdfBlob}
        offeringId={idRow}
      />
    </>
  );
};
