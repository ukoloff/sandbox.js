
export default async function findAccount(ctx, sub, token) {
  return {
    accountId: sub,
    async claims(use, scope, claims, rejected) {
      return {
        sub,
        email: `${sub}@no.where`,
      };
    },
  };
}
