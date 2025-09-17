import { api } from "@/server/server";
import { DataTable } from "@/components/ui/datatable";
import { CreateCategoryForm } from "./create-category-form";
import { CategoryColumns } from "./category-columns";

export default async function Home() {
  const categories = await api.category.getAllCategories();
  return (
    <DataTable
      columns={CategoryColumns}
      data={categories}
      CreateButton={<CreateCategoryForm />}
      name="Category"
      filterOn="name"
    />
  );
}
