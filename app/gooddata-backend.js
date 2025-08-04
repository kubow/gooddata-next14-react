//import tigerFactory from "@gooddata/sdk-backend-tiger";
import * as tigerBackend from "@gooddata/sdk-backend-tiger";
import { TigerTokenAuthProvider } from "@gooddata/sdk-backend-tiger";


const tigerFactory = tigerBackend.default ?? tigerBackend;

export const backend = tigerFactory()
  .onHostname(process.env.NEXT_PUBLIC_GD_HOSTNAME)
  .withAuthentication(
    new TigerTokenAuthProvider(process.env.NEXT_PUBLIC_GD_API_TOKEN)
  );