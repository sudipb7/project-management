import * as React from "react";
import { Body, Container, Head, Heading, Html, Link, Preview, Text } from "@react-email/components";

interface WorkspaceInviteMailProps {
  sendTo: {
    name: string;
    email: string;
  };
  invitedBy: {
    name: string;
    email: string;
  };
  workspaceName: string;
  inviteLink: string;
}

export const WorkspaceInviteMail: React.FC<Readonly<WorkspaceInviteMailProps>> = ({
  inviteLink,
  invitedBy,
  sendTo,
  workspaceName,
}) => (
  <Html>
    <Head />
    <Preview>You&apos;ve been invited to join {workspaceName}</Preview>
    <Body className="bg-gray-100 font-sans">
      <Container className="mx-auto px-4 py-8 max-w-xl">
        <Container className="bg-white rounded-lg shadow-lg p-8">
          <Heading className="text-3xl font-bold text-center text-gray-800 mb-6">
            Workspace Invitation
          </Heading>
          <Text className="text-lg text-gray-800 mb-4">Hi {sendTo.name},</Text>
          <Text className="text-lg text-gray-800 mb-4">
            You&apos;ve been invited to join the workspace{" "}
            <span className="font-semibold font-mono italic text-blue-600">{workspaceName}</span> by{" "}
            {invitedBy.name}.
          </Text>
          <Container className="bg-gray-50 rounded-md p-4 mb-6">
            <Text className="text-base text-gray-800 mb-2 font-medium">
              To accept the invitation:
            </Text>
            <Link
              href={inviteLink}
              className="block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
            >
              Join Workspace
            </Link>
          </Container>
          <Text className="text-base text-gray-800 mb-4">
            If the button above doesn&apos;t work, copy and paste this link into your browser:
          </Text>
          <Text className="text-base text-blue-500 break-all mb-6">{inviteLink}</Text>
        </Container>
        <Text className="text-sm text-center text-gray-500 mt-6">
          © 2024 Mk-1. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WorkspaceInviteMail;
