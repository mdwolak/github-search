import React from "react";

import type { User } from "~/lib/schemas/graphQL.schema";

const UserInfo: React.FC<User> = ({
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
    <div>
      <img src={avatarUrl} alt={`${login}'s avatar`} />
      <h2>{name}</h2>
      <p>{bio}</p>
      <ul>
        <li>ID: {id}</li>
        <li>Followers: {followers?.totalCount}</li>
        <li>Username: {login}</li>
        <li>Last updated: {new Date(updatedAt).toLocaleDateString()}</li>
        <li>
          <a href={url}>GitHub profile</a>
        </li>
        <li>{websiteUrl && <a href={websiteUrl}>Personal website</a>}</li>
      </ul>
    </div>
  );
};

export default UserInfo;
