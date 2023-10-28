import { router } from "../trpc";
import { exemplarRouter } from "./exemplar.router";
import { githubRouter } from "./github.router";
import { userRouter } from "./user.router";

export const appRouter = router({
  exemplar: exemplarRouter,
  user: userRouter,
  github: githubRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
