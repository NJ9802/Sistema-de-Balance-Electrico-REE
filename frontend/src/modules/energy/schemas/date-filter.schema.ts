import * as Yup from "yup";

export const dateFilterSchema = Yup.object().shape({
  startDate: Yup.string()
    .required("La fecha de inicio es obligatoria")
    .test(
      "is-before-end",
      "La fecha de inicio debe ser anterior a la fecha de fin",
      function (value, ctx) {
        const { endDate } = ctx.parent;
        return value < endDate;
      },
    ),

  endDate: Yup.string()
    .required("La fecha de fin es obligatoria")
    .test(
      "is-after-start",
      "La fecha de fin debe ser posterior a la fecha de inicio",
      function (value, ctx) {
        const { startDate } = ctx.parent;
        return value > startDate;
      },
    ),
});
