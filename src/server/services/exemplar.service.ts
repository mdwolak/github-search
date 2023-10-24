import { Prisma } from "@prisma/client";

import { type OmitAudit, getCreateProps, getUpdateProps, prisma } from "~/server/db";

export const defaultExemplarSelect = Prisma.validator<Prisma.ExemplarSelect>()({
  id: true,
  name: true,
  createdById: true,
});

//
// READ

export const findFirst = async (where: Partial<Prisma.ExemplarWhereInput>) => {
  return await prisma.exemplar.findFirst({
    where,
    select: defaultExemplarSelect,
  });
};

export const findUnique = async (where: Prisma.ExemplarWhereUniqueInput) => {
  return await prisma.exemplar.findUnique({
    where,
    select: defaultExemplarSelect,
  });
};

export const findAll = async (page: number, limit: number) => {
  const take = limit || 10;
  const skip = (page - 1) * limit;
  return await prisma.exemplar.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      content: true,
      createdAt: true,
      published: true,
    },
    skip,
    take,
  });
};

//
// WRITE

export const create = async (userId: number, input: OmitAudit<Prisma.ExemplarCreateInput>) => {
  return await prisma.exemplar.create({
    data: { ...input, ...getCreateProps(userId) },
    select: defaultExemplarSelect,
  });
};

export const update = async (
  userId: number,
  where: Prisma.ExemplarWhereUniqueInput,
  data: OmitAudit<Prisma.ExemplarUpdateInput>,
  select: Prisma.ExemplarSelect = defaultExemplarSelect
) => {
  return await prisma.exemplar.update({
    where,
    data: { ...data, ...getUpdateProps(userId) },
    select,
  });
};

export const remove = async (where: Prisma.ExemplarWhereUniqueInput) => {
  return await prisma.exemplar.delete({ where, select: defaultExemplarSelect });
};
