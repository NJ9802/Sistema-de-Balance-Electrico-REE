import DataIngestContainer from "../containers/DataIngestContainer";
import { DateFilterProvider } from "../context/DateRangeContext";

export const DataIngestPage = () => {
  return (
    <DateFilterProvider>
      <DataIngestContainer />
    </DateFilterProvider>
  );
};
