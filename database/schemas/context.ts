import { createRealmContext } from "@realm/react";
import { realmConfig } from "./index";

export const { RealmProvider, useRealm, useQuery } =
  createRealmContext(realmConfig);
