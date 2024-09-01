import React from "react";
import { Member, Profile } from "@prisma/client";

import { WorkspaceLeave } from "./leave";
import { WorkspaceImage } from "./avatar";
import { WorkspaceId } from "./workspace-id";
import { WorkspaceDeletion } from "./deletion";
import { WorkspaceDisplayName } from "./display-name";
import { WorkspaceDescription } from "./description";
import { WorkspaceWithMembers } from "@/types";

export interface WorkspacePreferencesProps {
  profile: Profile;
  isAdmin: boolean;
  members: Member[];
  admins: Member[];
  workspaces: WorkspaceWithMembers[];
  currentWorkspace: WorkspaceWithMembers;
}

export const WorkspacePreferences = (props: WorkspacePreferencesProps) => {
  return (
    <div className="space-y-6">
      <WorkspaceDisplayName {...props} />
      <WorkspaceDescription {...props} />
      <WorkspaceImage {...props} />
      <WorkspaceId {...props} />
      <WorkspaceLeave {...props} />
      <WorkspaceDeletion {...props} />
    </div>
  );
};
