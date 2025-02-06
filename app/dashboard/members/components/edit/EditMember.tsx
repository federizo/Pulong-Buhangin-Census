import React from "react";
import DailogForm from "../DialogForm";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import EditForm from "./EditorForm";
import { IPermission } from "@/lib/types";

export default function EditMember({
  isAdmin,

  permission,
}: {
  isAdmin: any;
  permission: IPermission;
}) {
  return (
    <DailogForm
      id="update-trigger"
      title="Edit User"
      Trigger={
        <Button
          variant="outline"
          className="dark:bg-gradient-dark bg-transparent hover:border-blue-300 hover:text-blue-300 "
        >
          <Pencil1Icon />
          Edit
        </Button>
      }
      form={<EditForm isAdmin={isAdmin} permission={permission} />}
    />
  );
}