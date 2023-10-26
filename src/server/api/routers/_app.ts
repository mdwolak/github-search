import { router } from "../trpc";
import { exampleRouter } from "./example.router";
import { exemplarRouter } from "./exemplar.router";
import { userRouter } from "./user.router";

export const appRouter = router({
  example: exampleRouter,
  exemplar: exemplarRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
