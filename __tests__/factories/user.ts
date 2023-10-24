import { type User, UserRole } from "@prisma/client";

import type { NonNullableProps } from "~/lib/common";

export const CompleteUser: NonNullableProps<User> = {
  id: 1,
  name: "Joe Bloggs",
  email: "Joe@Bloggs.com",
  password: "you_would_not_guess!",
  emailVerified: new Date(),
  image: "avatar.gif",
  createdDate: new Date(),
  updatedAt: new Date(),
  role: UserRole.User,
  provider: "default",
};

const UserFactory = {
  create: (args: Partial<User> = {}): User => {
    return {
      ...CompleteUser,
      ...args,
    };
  },
};

export default UserFactory;
