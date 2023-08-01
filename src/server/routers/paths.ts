export const partialPaths = {
  users: {
    base: "/users",
    register: "/register",
    login: "/login",
    activate: "/activate",
    verifyToken: "/verify-token",
    logout: "/logout",
    userData: "/user-data",
    forgottenPassword: "/forgotten-password",
    setNewPassword: "/set-new-password",
  },
  logs: {
    base: "/logs",
  },
};

export const paths = {
  root: "/",
  users: {
    register: `${partialPaths.users.base}${partialPaths.users.register}`,
    login: `${partialPaths.users.base}${partialPaths.users.login}`,
    activate: `${partialPaths.users.base}${partialPaths.users.activate}`,
    verifyToken: `${partialPaths.users.base}${partialPaths.users.verifyToken}`,
    logout: `${partialPaths.users.base}${partialPaths.users.logout}`,
    userData: `${partialPaths.users.base}${partialPaths.users.userData}`,
    forgottenPassword: `${partialPaths.users.base}${partialPaths.users.forgottenPassword}`,
    setNewPassword: `${partialPaths.users.base}${partialPaths.users.setNewPassword}`,
  },
  apiDocs: {
    base: "/api-docs",
  },
  logs: {
    logs: `${partialPaths.logs.base}`,
  },
};
