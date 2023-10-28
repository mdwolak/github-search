import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Octokit } from "@octokit/rest";
import { Octokit } from "@octokit/rest";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Link, toast } from "~/components/core";
import { getLayout } from "~/components/layouts/Layout";
import { api } from "~/utils/api";

//row shape
interface User {
  id: number;
  login: string;
  followers?: number;
  following?: number;
  //bio?: string;
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

const UserSearchList = () => {
  const router = useRouter();
  const [location, setLocation] = useState(router.query.location?.[0] || "");
  const [language, setLanguage] = useState(router.query.language?.[0] || "");
  const [enabled, setEnabled] = useState(true);

  const handleSearch = () => {
    console.log({ location, language });
    router.push({
      query: {
        ...router.query,
        location,
        language,
      },
    });
  };

  const {
    data: users = [],
    isLoading,
    refetch: fetchUsers,
  } = api.github.searchUsers.useQuery(
    { location, language },
    {
      select: (data) => data,
      enabled: false && (!!location || !!language),
      onError(error) {
        toast.error(error.message);
      },
    }
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    console.log("fetching");
    if (enabled) {
      setEnabled(false);
      fetchUsers();
      console.log("fetched");
    }
  }, []);

  console.log("Enabled", enabled);

  return (
    <>
      <div>
        <label htmlFor="">Location:</label>
        <input
          type="text"
          id=""
          defaultValue={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="language">Language:</label>
        <input
          type="text"
          id="language"
          defaultValue={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>
      <button onClick={handleSearch}>Search</button>
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