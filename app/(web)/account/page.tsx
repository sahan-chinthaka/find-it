"use client";

import { useEffect, useState } from "react";

function AccountPage() {
  const [test, setTest] = useState([10, 20, 30]);
  useEffect(() => {
    fetch("/api/user");
  }, []);

  return (
    <div className="page-wrap space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">My Account</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {test.map((i, k) => (
          <div key={k} className="glass-card rounded-2xl p-5 text-center">
            <p className="text-sm text-slate-500">Metric {k + 1}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{i}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AccountPage;
