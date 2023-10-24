import { type PrismaClient } from "@prisma/client";
import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

import { prisma } from "~/server/db";

jest.mock("~/server/db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
