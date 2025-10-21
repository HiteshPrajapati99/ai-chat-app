import { inviteForChat } from "@/api/chat";
import { getUsers } from "@/api/common";
import FormSelect from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { ModeToggle } from "../common/mode-toggle";

const inviteUserSchema = z.object({
  user_ids: z.array(z.string()).min(1, "Min 1 user is required"),
});

const NavBar = ({ chat_id }: { chat_id: string | null }) => {
  const [isInviteUserModal, setIsInviteUserModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      user_ids: [],
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    select: (response) => response.r || [],
    enabled: isInviteUserModal,
  });

  const handleInviteUser = async (data: z.infer<typeof inviteUserSchema>) => {
    setLoading(true);
    const res = await inviteForChat({
      chat_id: Number(chat_id),
      user_ids: data.user_ids.map(Number),
    });

    if (res.s === 0) {
      toast.error(res.m || "Invite failed");
      setLoading(false);
      return;
    }
    toast.success(res.m || "Invite success");
    setLoading(false);
    form.reset();
    setIsInviteUserModal(false);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between gap-4">
        <div></div>
        <div className="flex gap-2 items-center">
          <ModeToggle />
          {chat_id && (
            <Button
              variant="outline"
              onClick={() => setIsInviteUserModal(true)}
            >
              <Share2 /> Invite User
            </Button>
          )}
        </div>
      </div>

      <Dialog
        open={isInviteUserModal}
        onOpenChange={(open) => {
          setIsInviteUserModal(open);
          if (!open) {
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite user for chat</DialogTitle>
          </DialogHeader>
          <FormProvider {...form}>
            <form
              className="space-y-6 py-4"
              onSubmit={form.handleSubmit(handleInviteUser)}
            >
              <FormSelect
                name="user_ids"
                label="Select Users"
                isMulti
                isSearchable
                options={users.map((u) => ({
                  value: u.id.toString(),
                  label: u.username,
                }))}
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Invite"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavBar;
