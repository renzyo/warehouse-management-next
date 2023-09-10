"use client";

import LoadingIndicator from "@/components/loading-indicator";
import { Overview } from "@/components/overview";
import { Subheading } from "@/components/ui/subheading";
import axios from "axios";
import { Loader2Icon, TruckIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Sold = () => {
  const params = useParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSold = async () => {
      const response = await axios.get(`/api/${params.storeId}/sold`);
      const data = response.data.data;

      setData(data);
      setLoading(false);
    };

    getSold();

    const interval = setInterval(() => {
      getSold();
    }, 5000);

    return () => clearInterval(interval);
  }, [params.storeId]);

  if (loading) {
    return (
      <LoadingIndicator />
    );
  }

  return (
    <div className="w-full mt-4 p-4 bg-slate-300 rounded-lg">
      <Subheading
        icon={<TruckIcon className="w-8 h-8" />}
        title="Stok Terjual"
        description="Grafik stok barang terjual pada tahun ini setiap bulannya"
      />
      <div className="mt-8">
        <Overview data={data} />
      </div>
    </div>
  );
};

export default Sold;
