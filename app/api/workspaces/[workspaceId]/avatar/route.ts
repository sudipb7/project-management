import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/queries";
import { deleteFileFromS3, uploadFileToS3 } from "@/lib/s3";

export async function POST(req: Request, { params }: { params: { workspaceId: string } }) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileType = formData.get("fileType");
    const workspaceId = params.workspaceId;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    if (!file) {
      return new NextResponse("File is required", { status: 400 });
    }

    if (!fileType) {
      return new NextResponse("File type is required", { status: 400 });
    }

    const existingWorkspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        members: { some: { profileId: profile.id, role: MemberRole.ADMIN } },
      },
    });
    if (!existingWorkspace) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (existingWorkspace.image && !existingWorkspace.image.includes("img.clerk.com")) {
      const arr = existingWorkspace.image.split("/");
      const fileKey = arr[3] + "/" + arr[4];
      const deleted = await deleteFileFromS3(fileKey);
      if (!deleted) {
        return new NextResponse("Failed to delete existing file", { status: 500 });
      }
    }

    const fileKey = `${workspaceId}/avatar.${(fileType as string).split("/")[1]}`;
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    const res = await uploadFileToS3(buffer, fileKey, fileType as string);
    if (!res) {
      return new NextResponse("Failed to upload file", { status: 500 });
    }

    const workspace = await db.workspace.update({
      where: { id: workspaceId },
      data: { image: `https://${process.env.AWS_S3_BUCKET_HOST}/${fileKey}` },
    });

    if (!workspace) {
      return new NextResponse("Failed to update workspace", { status: 400 });
    }

    return new NextResponse("Workspace avatar updated successfully", { status: 200 });
  } catch (error) {
    console.error("[Method: POST, Path: /api/workspaces/:workspaceId/avatar]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { workspaceId: string } }) {
  try {
    const workspaceId = params.workspaceId;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    const existingWorkspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        members: { some: { profileId: profile.id, role: MemberRole.ADMIN } },
      },
    });
    if (!existingWorkspace) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (existingWorkspace.image && !existingWorkspace.image.includes("img.clerk.com")) {
      const arr = existingWorkspace.image.split("/");
      const fileKey = arr[3] + "/" + arr[4];
      const deleted = await deleteFileFromS3(fileKey);
      if (!deleted) {
        return new NextResponse("Failed to delete existing file", { status: 500 });
      }
    }

    const workspace = await db.workspace.update({
      where: { id: workspaceId },
      data: { image: null },
    });

    if (!workspace) {
      return new NextResponse("Failed to update workspace", { status: 400 });
    }

    return new NextResponse("Workspace avatar deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[Method: DELETE, Path: /api/workspaces/:workspaceId/avatar]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
