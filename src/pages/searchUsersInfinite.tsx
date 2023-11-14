import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { useInView } from "react-intersection-observer";

import UserInfo from "~/components/UserInfo";
import { Button, toast } from "~/components/core";
import { Spinner } from "~/components/core/Spinner";
import { Checkbox, Form, Input, ValidationSummary, useForm } from "~/components/forms";
import { type SearchUsersParamsInput, searchUsersParamsSchema } from "~/lib/schemas/ghUser.schema";
import { api } from "~/utils/api";

export default function Example() {
  const { ref, inView } = useInView();
  const router = useRouter();

  const filters = searchUsersParamsSchema.parse(router.query);
  const query = filters.query;
  console.log("router", filters.hasWebsiteUrl);

  const form = useForm({
    schema: searchUsersParamsSchema,
  });
  const { setFocus, reset } = form;

  useEffect(() => {
    console.log("filters", filters);
    reset({ ...filters });
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
      ...filters,
      limit: 10,
    },
    {
      enabled,
      getNextPageParam: (lastPage) => {
        //console.log("getNextPageParam", lastPage.pageInfo.endCursor);
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

  useEffect(() => {
    if (inView && hasNextPage) {
      console.log("fetchNextPage");
      fetchNextPage({});
    }
  }); //inView, hasNextPage, fetchNextPage

  const appendToQueryHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const query = form.getValues("query");
    if (!(query as string).includes(target.innerText)) {
      form.setValue("query", query + " " + target.innerText, { shouldDirty: true });
    }
  };

  return (
    <div className=" p-4">
      <Form form={form} handleSubmit={handleSearch} className="">
        <div className="flex w-full flex-row">
          <fieldset className="flex-1 flex-grow space-y-1">
            <ValidationSummary errors={form.formState.errors} />
            <Input
              label="Query"
              {...form.register("query")}
              placeholder="Enter query to start searching"
            />
            <div className="text-xs">
              Quick choices:{" "}
              <Button className="linkButton" onClick={appendToQueryHandler}>
                language:TypeScript
              </Button>
              {", "}
              <Button className="linkButton" onClick={appendToQueryHandler}>
                location:Poland
              </Button>
              {", "}
              <Button className="linkButton" onClick={appendToQueryHandler}>
                {"repos:>10"}
              </Button>
            </div>
            Client-side filters:
            <Checkbox label="Has Website" {...form.register("hasWebsiteUrl")} />
            Server-side filters:
            <Checkbox label="Extended" {...form.register("extended")} />
          </fieldset>
          <div className="flex py-7">
            <Button
              type="submit"
              isLoading={isLoading && enabled}
              //disabled={!form.formState.isDirty || !form.getValues("query")}
              className="ml-2">
              Search
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
          <UserInfo.Table>
            {data.pages.map((page) => (
              <React.Fragment key={page.pageInfo.endCursor}>
                {page.items.map((user) => (
                  <UserInfo.Row key={user.id} {...user} />
                ))}
              </React.Fragment>
            ))}
          </UserInfo.Table>
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
