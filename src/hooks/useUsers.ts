import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateUserInput = Omit<User, "id" | "created_at" | "updated_at">;
export type UpdateUserInput = Partial<CreateUserInput>;

async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw error;
  return data;
}

async function createUser(input: CreateUserInput): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function updateUser({ id, ...input }: UpdateUserInput & { id: string }): Promise<User> {
  const { data, error } = await supabase
    .from("users")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users"] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      // Optimistically update
      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          ["users"],
          previousUsers.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user
          )
        );
      }

      return { previousUsers };
    },
    onError: (_err, _updatedUser, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousUsers = queryClient.getQueryData<User[]>(["users"]);

      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          ["users"],
          previousUsers.filter((user) => user.id !== deletedId)
        );
      }

      return { previousUsers };
    },
    onError: (_err, _deletedId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
  });
}
