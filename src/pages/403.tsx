import type { NextPage } from "next";
import React from "react";

const Custom403: NextPage = () => {
  return (
    <div className="container">
      <div className="grid min-h-screen place-content-center">
        <div className="flex flex-col items-center">
          <div className="my-4 text-center">
            <h1 className="text-4xl">403 - Unauthorized</h1>
            <p className="">Please sign out and then sign it as admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom403;
