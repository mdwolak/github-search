/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";
import { type ZodError, type typeToFlattenedError } from "zod";

import { type ErrorHandlerOptions, getConstraintViolationError } from "~/server/api/trpcHelper";

describe("handleConstraintViolation", () => {
  describe("single column", () => {
    const errorHandlerOptions: ErrorHandlerOptions = {
      entityName: "Exemplar",
    };
    const message = "Exemplar with the same Content already exists";

    it("server-side error", () => {
      const error: TRPCError = getConstraintViolationError(["content"], errorHandlerOptions);

      expect(error).toBeInstanceOf(TRPCError);
      expect(error.message).toEqual(message);

      const cause = error.cause as ZodError;
      expect(cause.issues[0]?.message).toEqual(message);
      expect(cause.issues[0]?.path).toEqual(expect.arrayContaining(["content"]));
    });

    it("client-side error (flattened)", () => {
      const err: TRPCError = getConstraintViolationError(["content"], errorHandlerOptions);
      const error: typeToFlattenedError<any, string> = (err.cause as ZodError).flatten();
      expect(error.fieldErrors?.content?.[0]).toEqual(message);
    });
  });

  describe("multiple columns", () => {
    const errorHandlerOptions: ErrorHandlerOptions = {
      entityName: "Exemplar",
      dbFieldMappings: {
        content: "Content Label",
        category: "Category Label",
      },
    };

    const message = "Exemplar with the same Content Label and Category Label already exists";

    it("server-side error", () => {
      const error: TRPCError = getConstraintViolationError(
        ["content", "category"],
        errorHandlerOptions
      );
      expect(error).toBeInstanceOf(TRPCError);
      expect(error.code).toEqual("CONFLICT");
      expect(error.message).toEqual(message);
      expect(error.cause).toBeUndefined();
    });
  });
});
