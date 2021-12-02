// This lint rule does not seem to be properly understanding this file, which
// only contains TypeScript type declarations.
/* eslint-disable import/no-unused-modules */

// We are shimming react-redux instead of using @types/react-redux because we
// have some very complex types being stored in the Redux store that we do not
// have time to fully add type declarations for today.
//
// This can be removed once we add types to the Redux store.
declare module "react-redux";
