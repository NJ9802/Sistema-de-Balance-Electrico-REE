import EnergyBalanceContainer from "../containers/EnergyBalanceContainer";
import { DateFilterProvider } from "../context/DateRangeContext";

export const EnergyBalancePage = () => {
  return (
    <DateFilterProvider>
      <EnergyBalanceContainer />
    </DateFilterProvider>
  );
};
