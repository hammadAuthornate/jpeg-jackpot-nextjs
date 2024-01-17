import React from "react";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="py-16  overflow-hidden min-h-screen bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
};

export default BaseLayout;
