import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { useInView } from "react-intersection-observer";
import { z } from "zod";

import UserInfo from "~/components/UserInfo";
import { Button, Link, toast } from "~/components/core";
import { Spinner } from "~/components/core/Spinner";
import { Form, Input, ValidationSummary, useForm } from "~/components/forms";
import type { User } from "~/lib/schemas/graphQL.schema";
import { api } from "~/utils/api";

const searchUsersParamsSchema = z.object({
  query: z.string().optional(),
});
type SearchUsersParamsInput = z.infer<typeof searchUsersParamsSchema>;

/** Filters are applied on the results returned from server. This allows to use built-in paging on GitHub as is. */
const filterSchema = z.object({
  hasWebsiteUrl: z.coerce.boolean().optional(),
});
type FilterInput = z.infer<typeof filterSchema>;

const filterItems = (items: User[], filters: FilterInput): User[] => {
  return items.filter((user) => {
    if (Object.keys(user).length == 0) return false;
    if (filters.hasWebsiteUrl && !user.websiteUrl) return false;
    return true;
  });
};

export default function Example() {
  const { ref, inView } = useInView();
  const router = useRouter();

  const query = (router.query.query as string) || "";
  const filters = filterSchema.parse(router.query);

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

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = api.github.searchUsersInfinite.useInfiniteQuery(
    {
      limit: 10,
      query,
    },
    {
      enabled,
      getNextPageParam: (lastPage) => {
        console.log("getNextPageParam", lastPage.pageInfo.endCursor);
        return lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.endCursor : undefined;
      },
      onSuccess(data) {
        console.log(data);
      },
      onError(error) {
        toast.error(error.message);
      },
      staleTime: 60 * 60 * 1000,
      retry: false, //managed by octokit
      refetchOnWindowFocus: false,
    }
  );

  React.useEffect(() => {
    if (inView && hasNextPage) {
      console.log("fetchNextPage");
      fetchNextPage({});
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const appendToQueryHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const query = form.getValues("query");
    if (!(query as string).includes(target.innerText)) {
      form.setValue("query", query + " " + target.innerText, { shouldDirty: true });
    }
  };

  return (
    <div className="p-4">
      <Form form={form} handleSubmit={handleSearch} className="">
        <div className="flex w-full flex-row">
          <fieldset className="flex-1 flex-grow space-y-2">
            <ValidationSummary errors={form.formState.errors} />
            <Input
              label="Query"
              {...form.register("query")}
              placeholder="Enter query to start searching"
            />
            <Input type="checkbox" label="Has Website" {...form.register("hasWebsiteUrl")} />
            <div className="text-xs">
              Quick choices:{" "}
              <Link href={"javascript:void(0);"} onClick={appendToQueryHandler}>
                language:TypeScript
              </Link>
              {", "}
              <Link href={"javascript:void(0);"} onClick={appendToQueryHandler}>
                location:Poland
              </Link>
              {", "}
              <Link href={"javascript:void(0);"} onClick={appendToQueryHandler}>
                {"repo:>10"}
              </Link>
            </div>
          </fieldset>
          <div className="flex py-7">
            <Button
              type="submit"
              isLoading={isLoading && enabled}
              disabled={!form.formState.isDirty || !form.getValues("query")}
              className="ml-2">
              Save
            </Button>
          </div>
        </div>
      </Form>
      <div className="py-2">{data?.pages && `Found : ${data.pages[0]?.totalCount} users`}</div>
      {!enabled ? (
        <div></div>
      ) : status === "loading" ? (
        <p>
          <Spinner />
        </p>
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          {data.pages.map((page) => (
            <React.Fragment key={page.pageInfo.endCursor}>
              {filterItems(page.items, filters).map((user) => (
                <UserInfo key={user.id} {...user} />
              ))}
            </React.Fragment>
          ))}
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
            </button>
          </div>
          <div>{isFetching && !isFetchingNextPage ? "Background Updating..." : null}</div>
        </>
      )}
    </div>
  );
}
