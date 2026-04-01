import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Ban, CheckCircle2, Loader2, UserX } from "lucide-react";
import api from "@/lib/api";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      if (res.data?.success) {
        setUsers(res.data.data || []);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error("Failed to load users", err);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setIsToggling(id);
    try {
      const res = await api.put(`/admin/users/${id}/status`, {
        status: newStatus,
      });
      if (res.data?.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsToggling(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">
          User <span className="text-primary">Management</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage platform users
        </p>
      </motion.div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="clean-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Join Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-heading font-medium text-primary text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 capitalize">{user.role}</td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
                          user.status === "active"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {user.status === "active" ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          className={`p-2 rounded-lg transition-colors border ${
                            user.status === "active"
                              ? "text-destructive hover:bg-destructive/10 border-transparent hover:border-destructive/20"
                              : "text-success hover:bg-success/10 border-transparent hover:border-success/20"
                          } disabled:opacity-50`}
                          onClick={() => toggleStatus(user.id, user.status)}
                          disabled={isToggling === user.id}
                          title={
                            user.status === "active"
                              ? "Suspend User"
                              : "Activate User"
                          }
                        >
                          {isToggling === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : user.status === "active" ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
              <UserX className="w-12 h-12 mb-3 opacity-20" />
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
