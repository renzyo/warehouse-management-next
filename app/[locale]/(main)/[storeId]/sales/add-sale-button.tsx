"use client";

import { Button } from "@/components/ui/button";
import { useSaleModal } from "@/hooks/use-sale-modal";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

const AddSale = () => {
  const t = useTranslations("Sales");
  const saleStore = useSaleModal();

  return (
    <Button onClick={() => saleStore.onOpen()}>
      <PlusIcon className="w-4 h-4 mr-2" />
      {t("addSaleButton")}
    </Button>
  );
};

export default AddSale;
