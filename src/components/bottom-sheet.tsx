import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const BottomSheet = ({
  title,
  children,
  onClose,
  isOpen,
}: BottomSheetProps) => {
  function handleClose(open: boolean) {
    if (!open) {
      onClose();
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="p-0">
        {title && (
          <SheetHeader>
            <SheetTitle className="py-2">
              <h2 className="text-sm">{title}</h2>
            </SheetTitle>
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  );
};
