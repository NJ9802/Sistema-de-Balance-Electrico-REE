import EnergyGroupsBalanceContainer from "../containers/EnergyGroupsBalanceContainer";
import { DateFilterProvider } from "../context/DateRangeContext";

export const EnergyGroupsBalancePage = () => {
  return (
    <DateFilterProvider>
      <EnergyGroupsBalanceContainer />
    </DateFilterProvider>
  );
};
