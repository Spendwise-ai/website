import type { ColumnDef } from "@tanstack/vue-table";

import type { Task } from "../data/schema";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { h } from "vue";
import { labels, priorities, types } from "../data/data";
import DataTableColumnHeader from "./DataTableColumnHeader.vue";
import DataTableRowActions from "./DataTableRowActions.vue";

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
        class: "translate-y-0.5",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
        class: "translate-y-0.5",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "ID" }),
    cell: ({ row }) => h("div", { class: "w-20" }, row.getValue("id")),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "date",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Date" }),

    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return h("div", { class: "flex space-x-2" }, [
        h(
          Badge,
          { variant: "outline", class: "max-w-[500px] truncate font-medium" },
          format(row.getValue("date"), "dd-MM-yyyy"),
        ),
      ]);
    },
  },

  {
    accessorKey: "sender",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Sender" }),

    cell: ({ row }) => {
      return h("div", { class: "flex space-x-2" }, [
        row.getValue("sender").provider &&
          h("img", {
            src: `/bank-logo/${row.getValue("sender").provider}.png`,
            class: "w-6 h-6 rounded-full bg-white",
          }),
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          row.getValue("sender").name,
        ),
      ]);
    },
  },
  {
    accessorKey: "recipient",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Recipient" }),

    cell: ({ row }) => {
      return h("div", { class: "flex space-x-2" }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          row.getValue("recipient").name,
        ),
      ]);
    },
  },

  {
    aggregationFn: "sum",
    aggregatedCell: ({ getValue }) => {
      return `Total: ${getValue()}`;
    },
    accessorKey: "amount",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Amount" }),

    cell: ({ row }) => {
      return h("div", { class: "flex space-x-2" }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          row.getValue("amount"),
        ),
      ]);
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Name" }),

    cell: ({ row }) => {
      return h("div", { class: "flex space-x-2" }, [
        h(
          "span",
          { class: "max-w-[500px] truncate font-medium" },
          row.getValue("name"),
        ),
      ]);
    },
  },

  {
    accessorKey: "type",
    header: ({ column }) => h(DataTableColumnHeader, { column, title: "Type" }),

    cell: ({ row }) => {
      const type = types.find((type) => type.value === row.getValue("type"));

      if (!type) return null;

      return h("div", { class: "flex w-[100px] items-center" }, [
        type.icon &&
          h(type.icon, { class: "mr-2 h-4 w-4 text-muted-foreground" }),
        h("span", type.label),
      ]);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "category",
    header: ({ column }) =>
      h(DataTableColumnHeader, { column, title: "Category" }),

    cell: ({ row }) => {
      return h("div", { class: "flex space-x-2" }, [
        h(Badge, { class: "max-w-[500px] truncate font-medium" }, [
          // h(Icon, { class: "mr-2 h-4 w-4 text-muted-foreground" }),
          row.getValue("category").name,
        ]),
      ]);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
];
