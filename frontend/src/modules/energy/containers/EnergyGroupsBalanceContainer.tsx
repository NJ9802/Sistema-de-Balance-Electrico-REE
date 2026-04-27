import DateRangeChartLayout from "../components/DateRangeChartLayout";
import { EnergyBalanceChart } from "../components/EnergyBalanceChart";
import { useDateFilterContext } from "../context/DateRangeContext";
import { dateFilterDefaultValues } from "../hooks/useDateValidation";
import { useEnergyBalance } from "../hooks/useEnergyBalance";

const EnergyGroupsBalanceContainer = () => {
  const { startDate, endDate, hasErrors } = useDateFilterContext();

  const { data, isLoading, error } = useEnergyBalance(
    hasErrors
      ? `${dateFilterDefaultValues.startDate}T00:00`
      : `${startDate}T00:00`,
    hasErrors ? `${dateFilterDefaultValues.endDate}T23:59` : `${endDate}T23:59`,
  );
  return (
    <DateRangeChartLayout
      title="Balance de Energía por Grupo"
      isLoading={isLoading}
      error={error}
      data={data}
    >
      <EnergyBalanceChart
        records={data?.data.groups || []}
        categories={data?.data.groupCategories || []}
      />
    </DateRangeChartLayout>
  );
};

export default EnergyGroupsBalanceContainer;
