import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import classNames from "classnames";

const variants = {
  primary: "text-indigo-600 hover:text-indigo-900 font-medium hover:underline",
  secondary: "text-gray-600 hover:text-gray-900 hover:underline",
};

export type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> &
  NextLinkProps & {
    variant?: keyof typeof variants;
  };

export const Link = (props: LinkProps) => {
  const {
    href,
    variant = "primary",
    as,
    replace,
    scroll,
    shallow,
    prefetch,
    locale,
    className,
    children,
    ...rest
  } = props;

  return (
    <NextLink
      passHref={true}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
      className={classNames(variants[variant], className)}
      {...rest}>
      {children}
    </NextLink>
  );
};
