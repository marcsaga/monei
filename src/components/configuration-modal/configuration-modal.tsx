import { useRouter } from "next/router";
import { Dialog, DialogContent } from "../ui/dialog";
import { InvestmentsSection } from "./investments";
import { useEffect, useState } from "react";

export const ConfigurationModal = ({}) => {
  const { query, replace } = useRouter();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOpenModal(!!query.showConfig);
  }, [query.showConfig]);

  function handleClose() {
    const { showConfig: _, ...newQuery } = query;
    void replace({ query: newQuery });
  }

  return (
    <Dialog open={openModal} onOpenChange={handleClose}>
      <DialogContent className="min-h-[80%] max-w-screen-md overflow-auto py-10">
        <InvestmentsSection />
      </DialogContent>
    </Dialog>
  );
};
