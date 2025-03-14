import { Icon } from "#components";
import { h } from "vue";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: h(Icon, { name: "i-radix-icons-question-mark-circled" }),
  },
  {
    value: "todo",
    label: "Todo",
    icon: h(Icon, { name: "i-radix-icons-circle" }),
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: h(Icon, { name: "i-radix-icons-stopwatch" }),
  },
  {
    value: "done",
    label: "Done",
    icon: h(Icon, { name: "i-radix-icons-check-circled" }),
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: h(Icon, { name: "i-radix-icons-cross-circled" }),
  },
];
export const types = [
  {
    value: "expense",
    label: "Expense",
    icon: h(Icon, { name: "i-radix-icons-arrow-top-right" }),
  },
  {
    value: "todo",
    label: "Todo",
    icon: h(Icon, { name: "i-radix-icons-arrow-bottom-right" }),
  },
];

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: h(Icon, { name: "i-radix-icons-arrow-down" }),
  },
  {
    value: "medium",
    label: "Medium",
    icon: h(Icon, { name: "i-radix-icons-arrow-right" }),
  },
  {
    value: "high",
    label: "High",
    icon: h(Icon, { name: "i-radix-icons-arrow-up" }),
  },
];

export const groups = [
  { label: "Date", icon: "i-lucide-calendar", value: "date" },
];
