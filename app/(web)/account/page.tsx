"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface UserStats {
  user: {
    name: string;
    email: string;
    stats: {
      itemsReported: number;
      successfulMatches: number;
      pendingMatches: number;
    };
  };
}

function AccountPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch stats");
          return response.json();
        })
        .then((data) => {
          setStats(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error fetching user stats:", err);
          setError("Failed to load user statistics");
        })
        .finally(() => setIsLoading(false));
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="page-wrap">
        <p className="text-slate-500">Please sign in to view your account</p>
      </div>
    );
  }

  const statsList = stats?.user?.stats ? [
    { label: "Items Reported", value: stats.user.stats.itemsReported },
    { label: "Successful Matches", value: stats.user.stats.successfulMatches },
    { label: "Pending Requests", value: stats.user.stats.pendingMatches },
  ] : [];

  return (
    <div className="page-wrap space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">My Account</h1>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-3">
        {isLoading ? (
          <div className="col-span-3 text-slate-500">Loading...</div>
        ) : (
          statsList.map((stat, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-5 text-center"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))
        )}
      </div>
      {stats?.user && (
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Account Information</h2>
          <div className="space-y-2">
            <p className="text-slate-600"><span className="font-medium">Name:</span> {stats.user.name}</p>
            <p className="text-slate-600"><span className="font-medium">Email:</span> {stats.user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
