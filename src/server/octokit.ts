import { Octokit as OctokitCore } from "@octokit/core";
import { paginateGraphql } from "@octokit/plugin-paginate-graphql";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";

import { env } from "~/env/server.mjs";

export { RequestError } from "@octokit/request-error";
//DON'T Load to the client: export type { PageInfoForward, PageInfoBackward } from "@octokit/plugin-paginate-graphql";

/**
 * @see https://github.com/octokit/octokit.js
 * @see https://github.com/octokit/octokit.js/blob/main/src/octokit.ts
 * @see https://www.npmjs.com/package/@octokit/plugin-throttling
 */
export const Octokit = OctokitCore.plugin(
  restEndpointMethods,
  paginateRest,
  paginateGraphql,
  retry,
  throttling
).defaults({
  auth: env.GITHUB_AUTH_TOKEN,
  //userAgent: `octokit.js/${VERSION}`,
  throttle: {
    onRateLimit,
    onSecondaryRateLimit,
  },
});

// istanbul ignore next no need to test internals of the throttle plugin
function onRateLimit(retryAfter: number, options: any, octokit: any) {
  octokit.log.warn(`Request quota exhausted for request ${options.method} ${options.url}`);

  if (options.request.retryCount === 0) {
    // only retries once
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
}

// istanbul ignore next no need to test internals of the throttle plugin
function onSecondaryRateLimit(retryAfter: number, options: any, octokit: any) {
  octokit.log.warn(`SecondaryRateLimit detected for request ${options.method} ${options.url}`);

  if (options.request.retryCount === 0) {
    // only retries once
    octokit.log.info(`Retrying after ${retryAfter} seconds!`);
    return true;
  }
}

export type Octokit = InstanceType<typeof Octokit>;
