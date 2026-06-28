"use client";
import { useCheckout } from "@/context/CheckoutContext";
interface StepperCardProps {
  stepActive: number;
  text: string;
  stepNumber: number;
}

export const StepperCard = ({
  stepActive,
  text,
  stepNumber,
}: StepperCardProps) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <h2
        className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-semibold ${
          stepActive === stepNumber
            ? "bg-[var(--mamabear-dark-pink)] text-white"
            : "text-(#8B6352) bg-[var(--mamabear-light-pink)]"
        }`}
      >
        {stepNumber}
      </h2>
      <p className="hidden text-sm font-semibold text-[var(--mamabear-dark-pink)] md:block">
        {text}
      </p>
    </div>
  );
};
function StepperHeader() {
  const { state } = useCheckout();
  return (
    <div className="mb-5 flex items-center">
      {/* 1. Shipping Information */}
      <StepperCard
        stepActive={state.step}
        text="Shipping Information"
        stepNumber={1}
      />
      <div className="mx-2 h-0.5 flex-1 bg-[var(--mamabear-light-pink)]"></div>
      {/* 2. Shipping Method */}
      <StepperCard
        stepActive={state.step}
        text="Shipping Method"
        stepNumber={2}
      />
      <div className="mx-2 h-0.5 flex-1 bg-[var(--mamabear-light-pink)]"></div>
      {/* 3. Review */}
      <StepperCard stepActive={state.step} text="Review" stepNumber={3} />
    </div>
  );
}

export default StepperHeader;
