"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import useStoreModal from "@/app/hooks/useStoreModal";


export default function Home() {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
