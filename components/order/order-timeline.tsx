import { Check } from "lucide-react";
import { cn } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const steps: Array<{ value: OrderStatus; label: string }> = [
  { value: "placed", label: "Order placed" }, { value: "confirmed", label: "Confirmed" }, { value: "processing", label: "Processing" }, { value: "shipped", label: "Shipped" }, { value: "delivered", label: "Delivered" },
];
export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return <div className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">This order has been cancelled.</div>;
  const current = steps.findIndex((step) => step.value === status);
  return <div className="grid grid-cols-5">{steps.map((step, index) => <div key={step.value} className="relative flex flex-col items-center text-center"><div className={cn("absolute left-0 right-0 top-4 h-px bg-stone-200", index === 0 && "left-1/2", index === steps.length - 1 && "right-1/2")} /><div className={cn("relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs", index <= current ? "border-[#6f2742] bg-[#6f2742] text-white" : "border-stone-300 bg-white text-stone-400")}>{index < current ? <Check size={14} /> : index + 1}</div><p className={cn("mt-2 text-[10px] font-semibold sm:text-xs", index <= current ? "text-[#6f2742]" : "text-stone-400")}>{step.label}</p></div>)}</div>;
}
