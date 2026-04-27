import { createContext, useContext } from "react";
import { useDateValidation } from "../hooks/useDateValidation";

type DateFilterProviderProps = {
  children: React.ReactNode;
};

type DateFilterContextValue = ReturnType<typeof useDateValidation>;
// @ts-expect-error Need undefined initial value for context
const DateFilterContext = createContext<DateFilterContextValue | undefined>();

const DateFilterProvider = ({ children }: DateFilterProviderProps) => {
  const { register, startDate, endDate, errors, hasErrors } =
    useDateValidation();

  return (
    <DateFilterContext.Provider
      value={{ register, startDate, endDate, errors, hasErrors }}
    >
      {children}
    </DateFilterContext.Provider>
  );
};

const useDateFilterContext = () => {
  const context = useContext(DateFilterContext);
  if (context === undefined) {
    throw new Error("You must be inside a DateFilterProvider component");
  }
  return context;
};

export { useDateFilterContext, DateFilterProvider };
