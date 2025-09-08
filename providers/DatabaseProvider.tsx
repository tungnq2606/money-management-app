import { RealmProvider } from "@realm/react";
import React, { ReactNode } from "react";
import "react-native-get-random-values"; // Must be first import for BSON crypto polyfill
import { realmConfig } from "../database/schemas";

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  return <RealmProvider {...realmConfig}>{children}</RealmProvider>;
}
