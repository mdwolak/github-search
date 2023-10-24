import type { User } from "@prisma/client";

import { CompleteUser } from "../../../factories/user";
import { prismaMock, trpcRequest } from "../../../helpers";

const hashedPassword = "hashedPassword";

jest.mock("bcryptjs", () => ({
  hash: jest
    .fn()
    .mockImplementation((password, salt) =>
      Promise.resolve(password == CompleteUser.password ? hashedPassword : "wrongPassword")
    ),
}));

describe("User signs up", () => {
  it("Using existing e-mail", async () => {
    const { name, email, password } = CompleteUser;
    const input = { name, email, password, passwordConfirm: password };
    const caller = await trpcRequest();

    prismaMock.user.findUnique.mockResolvedValue({ name } as User);

    await expect(caller.user.create(input)).rejects.toThrowError(
      /Some attributes are already in use/
    );
    expect(prismaMock.user.create).not.toHaveBeenCalled();
  });

  test("Sending valid credentials", async () => {
    const { name, email, password, image, role } = CompleteUser;
    const input = { name, email, password, passwordConfirm: password };
    const caller = await trpcRequest();

    const expectedInput = {
      name: input.name.toLowerCase(),
      email: input.email.toLowerCase(),
      password: hashedPassword,
    };

    const mockCreateFn = jest.fn().mockResolvedValue({ name, image, role } as User);
    prismaMock.user.create.mockImplementation(mockCreateFn);
    const response = await caller.user.create(input);

    expect(mockCreateFn).toHaveBeenCalled();
    expect(mockCreateFn.mock.calls[0][0].data).toMatchObject(expectedInput);
    expect(response.user).toMatchObject({ name, image, role });
  });
});
