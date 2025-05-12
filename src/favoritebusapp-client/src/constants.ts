// ...existing code from constants.ts...
// the env variable services__api__http__0 is set by .NET Aspire
export const API_URL =
  typeof window === "undefined"
    ? `${process.env.services__api__http__0}/api`
    : "/api";
// ...existing code from constants.ts...
