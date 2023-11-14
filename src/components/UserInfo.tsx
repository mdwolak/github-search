import Image from "next/image";
import React from "react";

import { CurrencyDollarIcon, LinkIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

import { Link } from "~/components/core";
import type { RouterOutputs } from "~/utils/api";

const shadesOfBlack = Array.from({ length: 11 }, (_, i) => `hsl(0, 0%, ${90 - i * 9}%)`);

const getProviderIcon = (provider: string, url: string) => {
  if (["MASTODON", "TWITTER", "LINKEDIN", "YOUTUBE", "INSTAGRAM"].includes(provider)) {
    return { url, provider, icon: `/assets/${provider.toLowerCase()}.svg` };
  } else {
    return { url, provider };
  }
};

type User = RouterOutputs["github"]["searchUsersInfinite"]["items"][number];

const Row: React.FC<User> = ({
  avatarUrl,
  createdAt,
  email,
  followers,
  hasSponsorsListing,
  id,
  isHireable,
  location,
  login,
  name,
  socialAccounts,
  status,
  url, //profile url
  websiteUrl, //personal website
  extendedAttributes: ext,
}) => {
  return (
    <tr key={id}>
      <td>{location}</td>
      <td>{new Date(createdAt).getFullYear()}</td>
      <td>{followers?.totalCount}</td>
      <td>
        {websiteUrl && (
          <Link href={websiteUrl} target="_blank">
            <LinkIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </Link>
        )}
      </td>
      <td>
        {isHireable && <CurrencyDollarIcon className="h-5 w-5 text-green-500" aria-hidden="true" />}
        {hasSponsorsListing && (
          <CurrencyDollarIcon className="h-5 w-5 text-red-800" aria-hidden="true" />
        )}
      </td>
      <td>
        <span
          style={{ backgroundColor: `${shadesOfBlack[ext.activityIndex]}` }}
          className={`inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium text-black ring-1 ring-inset ring-green-600/20`}>
          {ext.activityIndex}
        </span>
      </td>{" "}
      <td className="w-10">
        <Link href={avatarUrl} target="_blank">
          <img
            className="h-8 w-8 rounded-md bg-gray-800"
            src={avatarUrl}
            alt={`${login}'s avatar`}
          />
        </Link>
      </td>
      <td>{ext.isContactable && "yes"}</td>
      <td>
        <div className="flex flex-row gap-1.5">
          <span className="text-sm font-medium">{name} </span>
          <Link href={url} target="_blank">
            {login}
          </Link>
          {SocialAccounts(socialAccounts)}
          {email && <Link href={`mailto:${email}`}>{email}</Link>}
        </div>
        {ext.companyHtml && (
          <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: ext.companyHtml }}></p>
        )}
        {ext.bioHtml && <p className="text-gray-500">{ext.bioHtml}</p>}
        {status?.message && <p className="text-gray-500">Status: {status?.message}</p>}
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
      <h2 className="text-base font-semibold leading-7">Latest activity</h2>
      <table className="mt-6 w-full text-left text-xs">
        <thead className="border-b border-white/10 text-sm leading-6 "></thead>
        <tbody className="divide-y divide-white/5">{children}</tbody>
      </table>
    </div>
  );
};

function SocialAccounts(socialAccounts: User["socialAccounts"]): React.ReactNode {
  return (
    socialAccounts.totalCount > 0 &&
    socialAccounts.nodes
      .map((account) => getProviderIcon(account.provider, account.url))
      .map((link, index) => (
        <a key={index} href={link.url} target="_blank" rel="noreferrer">
          {link.icon ? (
            <Image
              src={link.icon}
              alt={link.provider}
              className="inline-block h-3 w-3"
              width="20"
              height={20}
              priority={true}
            />
          ) : (
            <>
              {link.provider}
              <QuestionMarkCircleIcon className="mr-1 inline-block h-4 w-4" aria-hidden="true" />
            </>
          )}
        </a>
      ))
  );
}

const UserInfo = { Table, Row };
export default UserInfo;
