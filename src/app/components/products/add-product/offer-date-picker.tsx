import React from "react";
import Datepicker from "react-tailwindcss-datepicker";
import type { DateValueType } from "react-tailwindcss-datepicker";

type IPropType = {
  offerDate: DateValueType;
  setOfferDate: React.Dispatch<React.SetStateAction<DateValueType>>;
  defaultValue?: DateValueType;
  isRange?: boolean;
};

const OfferDatePicker = ({
  offerDate,
  setOfferDate,
  defaultValue,
  isRange = true,
}: IPropType) => {
  const handleValueChange = (newValue: DateValueType) => {
    setOfferDate(newValue);
  };

  return (
    <Datepicker
      useRange={isRange ? true : false}
      inputClassName="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
      value={defaultValue ?? offerDate}
      onChange={handleValueChange}
    />
  );
};

export default OfferDatePicker;
