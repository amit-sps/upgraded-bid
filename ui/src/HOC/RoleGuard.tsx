// RoleGuard.tsx
import React from "react";
import { Navigate } from "react-router-dom"; // or any routing library you use
import { Role, Roles } from "../assets";
import { useAppSelector } from "../redux/hooks";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}
const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  if (!isLoggedIn || !user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" />;
  }

  return <>{children}</>;
};

export const roleGuard = (hasAccess: Role[], userRole: Role) =>
  hasAccess.includes(userRole) || hasAccess.includes(Roles.ForAll);

export default RoleGuard;
