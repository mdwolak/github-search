import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import { Button, Link, toast } from "~/components/core";
import { Form, Input, ValidationSummary, useForm } from "~/components/forms";
import { getLayout } from "~/components/layouts/Layout";
import { api } from "~/utils/api";

//row shape
interface User {
  id: number;
  login: string;
  followers?: number;
  following?: number;
  //bio?: string;
  type: string;
  avatar_url: string;
  html_url: string;
}
const columnHelper = createColumnHelper<User>();
const columns = [
  // Accessor Column
  columnHelper.accessor("id", {
    header: "ID",
  }),
  // Accessor Column
  columnHelper.accessor("login", {
    header: "Login",
  }),
  // Accessor Column
  columnHelper.accessor("followers", {
    header: "Followers",
  }),
  // Accessor Column
  columnHelper.accessor("following", {
    header: "Following",
  }),
  // Accessor Column
  // columnHelper.accessor("bio", {
  //   header: "Bio",
  // }),
  // Accessor Column
  columnHelper.accessor("type", {
    header: "Type",
  }),
  // Accessor Column
  columnHelper.accessor("avatar_url", {
    header: "Avatar",
    cell: (props) => (
      <img className="inline-block h-14 w-14 rounded-md" src={props.getValue()} alt="avatar" />
    ),
  }),
  // Accessor Column
  columnHelper.accessor("html_url", {
    header: "Repos",
    cell: (props) => (
      <Link href={props.getValue()} target="_blank" rel="noreferrer">
        Repositories
      </Link>
    ),
  }),
];

const searchParamsSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  language: z.string().optional(),
});
type SearchParamsInput = z.infer<typeof searchParamsSchema>;

const UserSearchList = () => {
  const router = useRouter();

  const query = (router.query.query as string) || "";
  const location = (router.query.location as string) || "";
  const language = (router.query.language as string) || "";

  const form = useForm({
    schema: searchParamsSchema,
  });
  const { setFocus } = form;

  useEffect(() => {
    setFocus("location");
    const data = { query, location, language };
    form.reset(data);
  }, [query, location, language]);

  const enabled = Boolean(location || language || query);

  const handleSearch = (data: SearchParamsInput) => {
    console.log(data);
    router.push({
      query: {
        ...router.query,
        ...data,
      },
    });
  };

  const { data: users = [], isLoading } = api.github.searchUsers.useQuery(
    { query, location, language },
    {
      select: (data) => data,
      enabled,
      onSuccess(data) {
        console.log(data);
      },
      onError(error) {
        toast.error(error.message);
      },
      //staleTime: 60 * 60 * 1000,
      retry: false, //managed by octokit
      refetchOnWindowFocus: false,
    }
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSearch}
        className="flex h-full flex-col bg-white shadow-xl">
        <div className="h-0 flex-1 overflow-y-auto">
          {/* Content */}
          <fieldset className="space-y-6 p-4 pt-6">
            <ValidationSummary errors={form.formState.errors} />
            {/* <ApiErrorMessage error={apiError} visible={form.formState.isValid} /> */}

            <Input label="Query" {...form.register("query")} />
            <Input label="Location" {...form.register("location")} />
            <Input label="Language" {...form.register("language")} />
          </fieldset>
          {/* /End Content */}
        </div>

        <div className="sm:px-6; flex border-t border-gray-200 px-4 py-5">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading && enabled}
            disabled={!form.formState.isDirty}>
            Save
          </Button>
        </div>
      </Form>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

UserSearchList.getLayout = getLayout;
export default UserSearchList;
