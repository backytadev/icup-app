import { useState, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface ReceiptPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfBlob: Blob | null;
  offeringId: string;
}

export const ReceiptPreviewModal = ({
  open,
  onOpenChange,
  pdfBlob,
  offeringId,
}: ReceiptPreviewModalProps): JSX.Element => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Cleanup
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  const handlePrint = (): void => {
    if (pdfUrl) {
      // Create hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';

      // Append to body
      document.body.appendChild(iframe);

      // Set source and print when loaded
      iframe.onload = () => {
        if (iframe.contentWindow) {
          let printDialogClosed = false;

          // Cleanup function
          const cleanup = () => {
            if (!printDialogClosed) {
              printDialogClosed = true;
              // Close the modal after printing
              onOpenChange(false);

              // Remove iframe
              setTimeout(() => {
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe);
                }
              }, 100);
            }
          };

          // Listen for after print event (works in most browsers)
          iframe.contentWindow.addEventListener('afterprint', cleanup);

          // Also listen on main window as fallback
          const mainWindowAfterPrint = () => {
            cleanup();
            window.removeEventListener('afterprint', mainWindowAfterPrint);
          };
          window.addEventListener('afterprint', mainWindowAfterPrint);

          // Detect when window regains focus (user closed print dialog)
          const handleFocus = () => {
            // Small delay to ensure print dialog actually closed
            setTimeout(() => {
              cleanup();
              window.removeEventListener('focus', handleFocus);
            }, 300);
          };

          // Add focus listener after a short delay (to avoid immediate trigger)
          setTimeout(() => {
            window.addEventListener('focus', handleFocus, { once: true });
          }, 500);

          // Trigger print dialog
          iframe.contentWindow.print();
        }
      };

      iframe.src = pdfUrl;
    }
  };

  const handleDownload = (): void => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `recibo-ofrenda-${offeringId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl h-[80vh] p-0 gap-0 flex flex-col'>
        <DialogHeader className='px-6 py-4 border-b border-slate-200 dark:border-slate-700 '>
          <div className='flex items-center justify-between'>
            <div>
              <DialogTitle className='text-xl font-bold text-slate-900 dark:text-slate-100'>
                Recibo de Ofrenda
              </DialogTitle>
              <DialogDescription className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                Previsualización del recibo generado
              </DialogDescription>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={handlePrint}
                className='gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              >
                <Printer className='h-4 w-4' />
                Imprimir
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownload}
                className='gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 mr-4'
              >
                <Download className='h-4 w-4' />
                Descargar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className='flex-1 overflow-hidden bg-slate-100 dark:bg-slate-900'>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className='w-full h-full'
              title='Recibo de Ofrenda'
              style={{ border: 'none' }}
            />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4'></div>
                <p className='text-slate-500 dark:text-slate-400'>Generando recibo...</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
