import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

interface UserStats {
  total: number;
  active: number;
  inactive: number;
}

async function fetchUserStats(): Promise<UserStats> {
  const { data, error } = await supabase
    .from("users")
    .select("status");

  if (error) throw error;

  const total = data.length;
  const active = data.filter((u) => u.status === true).length;
  const inactive = data.filter((u) => u.status === false).length;

  return { total, active, inactive };
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
  });

  const cards = [
    {
      title: "Total Users",
      value: stats?.total ?? 0,
      icon: Users,
      description: "All registered users",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Users",
      value: stats?.active ?? 0,
      icon: UserCheck,
      description: "Currently active",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Inactive Users",
      value: stats?.inactive ?? 0,
      icon: UserX,
      description: "Currently inactive",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to your admin dashboard. Here's an overview of your users.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title} className="card-shadow transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-9 w-20" />
              ) : error ? (
                <span className="text-destructive">Error</span>
              ) : (
                <>
                  <div className="text-3xl font-bold">{card.value}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity section */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : error ? (
            <p className="text-destructive">Failed to load statistics</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active rate</span>
                <span className="font-semibold">
                  {stats && stats.total > 0
                    ? `${Math.round((stats.active / stats.total) * 100)}%`
                    : "0%"}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-success transition-all duration-500"
                  style={{
                    width: stats && stats.total > 0
                      ? `${(stats.active / stats.total) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.active} out of {stats?.total} users are currently active
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
