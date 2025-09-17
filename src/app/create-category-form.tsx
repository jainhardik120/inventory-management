"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category, createCategorySchema } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/server/react";
import { useRouter } from "next/navigation";

export const CreateCategoryForm = () => {
  const mutation = api.category.createCategory.useMutation();
  return (
    <CategoryForm
      defaultValues={{
        name: "",
        description: "",
        imageUrl: "",
      }}
      mutation={mutation}
      buttonText="Create new category"
      saveButtonText="Create"
    />
  );
};

export const UpdateCategoryForm = ({ category }: { category: Category }) => {
  const { mutateAsync, isPending } = api.category.updateCategory.useMutation();
  const updateMutateAsync = (data: z.infer<typeof createCategorySchema>) =>
    mutateAsync({ id: category.id, createCategorySchema: data });
  return (
    <CategoryForm
      defaultValues={{
        ...category,
        description: category.description ?? undefined,
        imageUrl: category.imageUrl ?? undefined,
      }}
      mutation={{ mutateAsync: updateMutateAsync, isPending }}
      buttonText="Update category"
      saveButtonText="Update"
    />
  );
};

function CategoryForm({
  defaultValues,
  mutation,
  buttonText,
  saveButtonText,
}: Readonly<{
  defaultValues: z.infer<typeof createCategorySchema>;
  mutation: {
    mutateAsync: (data: z.infer<typeof createCategorySchema>) => Promise<void>;
    isPending: boolean;
  };
  buttonText: string;
  saveButtonText: string;
}>) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: defaultValues,
  });
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation
                .mutateAsync(data)
                .then(() => {
                  toast("Category created successfully");
                  setOpen(false);
                  router.refresh();
                })
                .catch(() => {
                  toast.error("Something went wrong");
                });
            })}
          >
            <DialogHeader>
              <DialogTitle>{buttonText}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : saveButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
