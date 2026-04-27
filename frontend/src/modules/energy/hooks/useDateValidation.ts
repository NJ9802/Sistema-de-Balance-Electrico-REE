import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { dateFilterSchema } from "../schemas/date-filter.schema";

export const dateFilterDefaultValues = {
  startDate: "2026-04-01",
  endDate: "2026-04-07",
};

export const useDateValidation = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(dateFilterSchema),
    defaultValues: dateFilterDefaultValues,
    mode: "onChange",
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const hasErrors = Object.keys(errors).length > 0;

  console.log({ errors });

  return { register, startDate, endDate, errors, hasErrors };
};
