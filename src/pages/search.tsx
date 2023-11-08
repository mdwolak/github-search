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
import type { User } from "~/lib/schemas/graphQL.schema";
import { api } from "~/utils/api";

//row shape
const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("login", {
    header: "Login",
  }),
  columnHelper.accessor("followers.totalCount", {
    header: "Followers",
  }),
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("bio", {
    header: "Bio",
  }),
  columnHelper.accessor("websiteUrl", {
    header: "websiteUrl",
  }),
  columnHelper.accessor("avatarUrl", {
    header: "Avatar",
    cell: (props) => (
      <img className="inline-block h-14 w-14 rounded-md" src={props.getValue()} alt="avatar" />
    ),
  }),
  columnHelper.accessor("url", {
    header: "Repos",
    cell: (props) =>
      props.getValue() && (
        <Link href={props.getValue() as string} target="_blank" rel="noreferrer">
          Repositories
        </Link>
      ),
  }),
];

const searchUsersParamsSchema = z.object({
  query: z.string().optional(),
});
type SearchUsersParamsInput = z.infer<typeof searchUsersParamsSchema>;

const UserSearchList = () => {
  const router = useRouter();

  const query = (router.query.query as string) || "";

  const form = useForm({
    schema: searchUsersParamsSchema,
  });
  const { setFocus, reset } = form;

  useEffect(() => {
    const data = { query };
    reset(data);
    setFocus("query");
  }, [query, reset, setFocus]);

  const enabled = Boolean(query);

  const handleSearch = (data: SearchUsersParamsInput) => {
    console.log(data);
    router.push({
      query: {
        ...router.query,
        ...data,
      },
    });
  };

  const { data: response, isLoading } = api.github.searchUsers.useQuery(
    { query },
    {
      //select: (data: SearchUsersResponse["search"]) => data,
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
    data: response?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Form
        form={form}
        handleSubmit={handleSearch}
        className="flex h-full flex-col bg-white shadow-xl">
        <fieldset className="space-y-6 p-4 pt-6">
          <ValidationSummary errors={form.formState.errors} />
          <Input label="Query" {...form.register("query")} />
        </fieldset>

        <div className="sm:px-6; flex border-t border-gray-200 px-4 py-5">
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading && enabled}
            disabled={!form.formState.isDirty || !form.getValues("query")}>
            Save
          </Button>
        </div>
      </Form>
      {!enabled ? (
        <div>Enter query to start searching</div>
      ) : isLoading ? (
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
