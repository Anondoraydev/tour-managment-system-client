import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div>
      <h2>This is AdminLayout</h2>
      <Outlet />
    </div>
  );
}
