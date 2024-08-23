import React from "react";

import { WorkspaceLeave } from "./leave";
import { WorkspaceImage } from "./avatar";
import { WorkspaceId } from "./workspace-id";
import { WorkspaceDeletion } from "./deletion";
import { WorkspaceDisplayName } from "./display-name";

export interface WorkspacePreferencesProps {
  user: any;
  isAdmin: boolean;
  members: any[];
  admins: any[];
  workspaces: any[];
  currentWorkspace: any;
}

export const WorkspacePreferences = (props: WorkspacePreferencesProps) => {
  return (
    <div className="space-y-6">
      <WorkspaceDisplayName {...props} />
      <WorkspaceImage {...props} />
      <WorkspaceId {...props} />
      <WorkspaceLeave {...props} />
      <WorkspaceDeletion {...props} />
    </div>
  );
};
