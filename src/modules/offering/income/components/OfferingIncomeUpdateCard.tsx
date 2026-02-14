import { useState, useCallback, useMemo } from 'react';
import { Pencil } from 'lucide-react';

import {
  useOfferingIncomeStore,
  selectSearchData,
} from '@/modules/offering/income/stores/offering-income.store';

import { OfferingIncomeUpdateForm, ReceiptPreviewModal } from '@/modules/offering/income/components';

import { generateReceiptByOfferingIncomeId } from '@/modules/offering/income/services/offering-income.service';

import { FormModal } from '@/shared/components/modal';
import { Button } from '@/shared/components/ui/button';

interface OfferingIncomeUpdateCardProps {
  idRow: string;
}

export const OfferingIncomeUpdateCard = ({ idRow }: OfferingIncomeUpdateCardProps): JSX.Element => {
  //* States
  const searchData = useOfferingIncomeStore(selectSearchData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  //* Functions
  const currentOfferingIncome = useMemo(
    () => searchData?.find((data) => data?.id === idRow),
    [searchData, idRow]
  );

  const handleClose = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const handleScrollToTop = useCallback((): void => {
    // FormModal handles scroll internally via topRef
  }, []);

  const handleUpdateSuccess = useCallback(async (offeringId: string) => {
    // Generate receipt after successful update
    try {
      const response = await generateReceiptByOfferingIncomeId({
        id: offeringId,
        shouldOpenReceiptInBrowser: 'no',
        generationType: 'with-qr',
      });

      if (response?.data) {
        setPdfBlob(response.data);
        setIsPreviewModalOpen(true);
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  }, []);

  const handlePreviewModalClose = useCallback((open: boolean) => {
    setIsPreviewModalOpen(open);
    if (!open) {
      setPdfBlob(null);
    }
  }, []);

  return (
    <>
      <FormModal
        open={isOpen}
        onOpenChange={setIsOpen}
        maxWidth='2xl'
        trigger={
          <Button
            variant='ghost'
            className='h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-300 dark:hover:bg-amber-900/20'
          >
            <Pencil className='h-4 w-4' />
          </Button>
        }
      >
        <OfferingIncomeUpdateForm
          id={idRow}
          data={currentOfferingIncome}
          dialogClose={handleClose}
          scrollToTop={handleScrollToTop}
          onUpdateSuccess={handleUpdateSuccess}
        />
      </FormModal>

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
