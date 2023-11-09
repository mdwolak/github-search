import React from "react";

import type { User } from "~/lib/schemas/graphQL.schema";

const Row: React.FC<User> = ({
  avatarUrl,
  bio,
  id,
  followers,
  login,
  name,
  updatedAt,
  url,
  websiteUrl,
}) => {
  return (
    /* <p>{bio}</p>
        <li>Followers: {followers?.totalCount}</li>
        <li>
          <a href={url}>GitHub profile</a>
        </li>
        <li>{websiteUrl && <a href={websiteUrl}>Personal website</a>}</li> */

    <tr key={id}>
      <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
        <div className="flex items-center gap-x-4">
          <img
            className="h-8 w-8 rounded-md bg-gray-800"
            src={avatarUrl}
            alt={`${login}'s avatar`}
          />
          <div className="truncate text-sm font-medium leading-6 text-white">{name}</div>
        </div>
      </td>
      <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
        <div className="flex gap-x-3">
          <div className="font-mono text-sm leading-6 text-gray-400">{id}</div>
          <span className="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
            {bio}
          </span>
        </div>
      </td>
      <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
        <div className="flex items-center justify-end gap-x-2 sm:justify-start">
          <time className="text-gray-400 sm:hidden" dateTime={updatedAt}>
            {updatedAt}
          </time>
          {/* <div className={classNames(statuses[status], 'flex-none rounded-full p-1')}>
               <div className="h-1.5 w-1.5 rounded-full bg-current" />
             </div> */}
          <div className="hidden text-white sm:block">{url}</div>
        </div>
      </td>
      <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
        {login}
      </td>
      <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
        <time dateTime={updatedAt}>{new Date(updatedAt).toLocaleDateString()}</time>
      </td>
    </tr>
  );
};

type Props = {
  children: React.ReactNode;
};

const Table: React.FC<Props> = ({ children }) => {
  return (
    /* Activity list */
    <div className="border-t border-white/10 pt-11">
      <h2 className="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">
        Latest activity
      </h2>
      <table className="mt-6 w-full whitespace-nowrap text-left">
        {/* <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup> */}
        <thead className="border-b border-white/10 text-sm leading-6 text-white">
          <tr>
            <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
              User
            </th>
            <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
              Commit
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
              Status
            </th>
            <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
              Duration
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
              Deployed at
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
};

const UserInfo = { Table, Row };
export default UserInfo;
