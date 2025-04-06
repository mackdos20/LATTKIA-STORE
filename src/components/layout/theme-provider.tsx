import * as React from "react";

export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<{}>) {
  return (
    <>{children}</>
  );
}