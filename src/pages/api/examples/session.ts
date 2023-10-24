// This is an example of how to access a session from an API route
import type { NextApiRequest, NextApiResponse } from "next";

import { getServerAuthSession } from "~/server/lib/getServerAuthSession";

const session = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  res.send(JSON.stringify(session, null, 2));
};
export default session;
