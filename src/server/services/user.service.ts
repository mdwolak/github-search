import { Prisma } from "@prisma/client";

import { prisma } from "~/server/db";

export const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  image: true,
  updatedAt: true,
  role: true,
});

export const findFirst = async (
  where: Partial<Prisma.UserWhereInput>,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return await prisma.user.findFirst({
    where,
    select,
  });
};

export const findUnique = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({
    where,
    select: defaultUserSelect,
  });
};

export const findUniqueSensitive = async (where: Prisma.UserWhereUniqueInput) => {
  return await prisma.user.findUnique({
    where,
    select: {
      id: true,
      // username: true,
      name: true,
      email: true,
      // identityProvider: true,
      //image: true,
      password: true,
      //createdDate: true,
      role: true,
      orgId: true,
    },
  });
};

export const create = async (input: Prisma.UserCreateInput) => {
  //IMPROVE: do not return sensitive data exemplar-creation
  return await prisma.user.create({
    data: input,
    select: defaultUserSelect,
  });
};

export const update = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput,
  select: Prisma.UserSelect = defaultUserSelect
) => {
  return await prisma.user.update({ where, data, select });
};
