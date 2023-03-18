import React from "react";

interface DashboardLayoutProps {
  children?: React.ReactNode;
  heading: string;
}

function DashboardLayout({ heading, children }: DashboardLayoutProps) {
  return (
    <React.Fragment>
      <h1 className="text-3xl font-bold text-gray-800">{heading}</h1>
    </React.Fragment>
  );
}

export function UserDashboard() {
  return <DashboardLayout heading="Overview" />;
}
