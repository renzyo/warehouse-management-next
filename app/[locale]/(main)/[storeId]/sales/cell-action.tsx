"use client";

import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { SalesColumn } from "./columns";
import { useSaleModal } from "@/hooks/use-sale-modal";
import { useTranslations } from "next-intl";

interface CellActionProps {
  data: SalesColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const t = useTranslations("Sales");
  const saleModalStore = useSaleModal();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sales/${data.id}`, {
        data: {
          productId: data.product.id,
          quantity: parseInt(data.quantity),
        },
      });
      toast.success(t("deleteSaleSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("deleteSaleFailed"));
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirmDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("action")}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              saleModalStore.setIsEditing(true);
              saleModalStore.setSaleData({
                id: data.id,
                merchantId: data.merchant.id,
                productId: data.product.id,
                saleDate: data.saleDate,
                quantity: data.quantity.toString(),
              });
              saleModalStore.onOpen();
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> {t("actionUpdate")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> {t("actionDelete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
