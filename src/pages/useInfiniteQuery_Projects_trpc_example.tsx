import Link from "next/link";
import React from "react";

import { QueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { toast } from "~/components/core";
import { api } from "~/utils/api";

const queryClient = new QueryClient();

export default function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    <Example />
    // </QueryClientProvider>
  );
}

function Example() {
  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = api.github.infinitePosts.useInfiniteQuery(
    {
      limit: 6,
    },
    //{ query:"", location: "TypeScript", language: "Poland" },
    {
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
      getPreviousPageParam: (firstPage) => firstPage.previousId ?? undefined,
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

  React.useEffect(() => {
    if (inView && hasNextPage) {
      console.log("fetchNextPage");
      fetchNextPage({});
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      <h1>Infinite Loading</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : status === "error" ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}>
              {isFetchingPreviousPage
                ? "Loading more..."
                : hasPreviousPage
                ? "Load Older"
                : "Nothing more to load"}
            </button>
          </div>
          {data.pages.map((page) => (
            <React.Fragment key={page.nextId}>
              {page.data.map((project) => (
                <p
                  style={{
                    border: "1px solid gray",
                    borderRadius: "5px",
                    padding: "10rem 1rem",
                    background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
                  }}
                  key={project.id}>
                  {project.name}
                </p>
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
      <hr />
      <Link href="/about" legacyBehavior>
        <a>Go to another page</a>
      </Link>
    </div>
  );
}
