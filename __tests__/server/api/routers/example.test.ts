import { type RouterInputs, RouterOutputs, prismaMock, trpcRequest } from "../../../helpers";

//trpcRequest(UserFactory.create());

test("example router", async () => {
  const caller = await trpcRequest();

  type Input = RouterInputs["example"]["hello"];
  const input: Input = {
    text: "test",
  };

  const example = await caller.example.hello(input);

  expect(example).toMatchObject({ greeting: "Hello test" });
});

test("example router", async () => {
  prismaMock.example.findMany.mockResolvedValue([]);

  const caller = await trpcRequest();

  const example = await caller.example.getAll();

  expect(example).toMatchObject([]);
});
