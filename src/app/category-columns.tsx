"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UpdateCategoryForm } from "./create-category-form";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { api } from "@/server/react";
import { useRouter } from "next/navigation";

export const CategoryColumns: ColumnDef<Category>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "imageUrl", header: "Image URL" },
  {
    id: "edit",
    header: "Edit",
    cell: ({ row }) => <UpdateCategoryForm category={row.original} />,
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const { mutateAsync } = api.category.deleteCategory.useMutation();
      return (
        <Button
          variant="destructive"
          onClick={() => mutateAsync({ id: row.original.id })}
        >
          Delete
        </Button>
      );
    },
  },
];
