import { TRPCError } from "@trpc/server";
import type { ZodError } from "zod";

import { camelCaseToSpacedOut } from "~/lib/common";
import { type Context } from "~/server/api/context";
import { getZodErrorWithCustomIssue } from "~/server/api/zodHelper";
import { getConstraintViolationFields, isNotFoundError } from "~/server/db";

export function getUserId(ctx: Context) {
  const userId = ctx.session?.user?.id;
  if (userId == null) {
    throw new Error("getUserId failed to obtain user id from session");
  }
  return userId;
}

/**
 * TRPC request handlers
 **/

/**
 * The below function should wrap body of every TRPC procedure to ensure that errors are handled consistently.
 **/
export const handleRequest = async <T>(
  handler: () => Promise<T>,
  errorHandler: (error: unknown) => void
) => {
  try {
    return await handler();
  } catch (error) {
    errorHandler(error);

    throw error;
  }
};

function mapAttributesToFriendlyNames(attributes: string[], mappings: Record<string, string>) {
  return attributes.map((attribute) => mappings[attribute] || camelCaseToSpacedOut(attribute));
}

export interface ErrorHandlerOptions {
  entityName: string;
  dbFieldMappings?: Record<string, string>;
}
/**
 * Generic error handler for unhandled errors raised by TRPC procedures.
 * If you want to handle an error in a specific way, throw a TRPCError inside the procedure.
 *
 * Notes: This could be called in the global trpc.onError handler, were it not for errorHandlerOptions that are service/procedure specific.
 */
export function getErrorFromUnknown(cause: unknown, options: ErrorHandlerOptions) {
  if (cause instanceof TRPCError) {
    return cause;
  }

  if (isNotFoundError(cause)) {
    return httpNotFound(options.entityName);
  }

  const dbFields = getConstraintViolationFields(cause);
  if (dbFields) {
    return getConstraintViolationError(dbFields, options);
  }

  return cause;
}

export function getConstraintViolationError(dbFields: string[], options: ErrorHandlerOptions) {
  const { entityName, dbFieldMappings } = options;

  const friendlyFieldNames = mapAttributesToFriendlyNames(dbFields, dbFieldMappings || {});

  const friendlyString = friendlyFieldNames.join(" and ");
  //short versions without entity name: Email already taken. This email is already used.
  const message = `${entityName} with the same ${friendlyString} already exists`;

  //constraint violation on a single attribute will be shown inline (setFormErrors)
  if (dbFields.length === 1) {
    const zodError = getZodErrorWithCustomIssue(message, dbFields);
    return httpConflict(message, zodError);
  }
  //constraint violation on multiple attributes will be shown in toast or ApiErrorMessage
  return httpConflict(message);
}

/**
 * TRPC Errors throw by tha application
 * @see https://trpc.io/docs/server/error-handling#error-codes
 **/

export function httpConflict(message: string, cause?: unknown) {
  return new TRPCError({
    code: "CONFLICT",
    message,
    cause,
  });
}

export function httpConflictWithZod(cause: ZodError) {
  return new TRPCError({
    code: "CONFLICT",
    message: "Some attributes are already in use.",
    cause,
  });
}

export function httpForbidden(): TRPCError {
  return new TRPCError({
    code: "FORBIDDEN",
    message: "You don't have permission to access this resource",
  });
}

export function httpUnauthorized(): TRPCError {
  return new TRPCError({
    code: "UNAUTHORIZED",
    message: "You must be logged in to access this resource",
  });
}

export function httpNotFound(entityName: string) {
  return new TRPCError({
    code: "NOT_FOUND",
    message: `The requested ${entityName} was not found`,
  });
}

export function httpInternalServerError(error: unknown) {
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: (error as Error).message,
  });
}
