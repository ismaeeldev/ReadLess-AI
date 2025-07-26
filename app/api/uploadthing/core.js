import { currentUser } from "@clerk/nextjs/server"; // Correct Clerk import for JS
import { createUploadthing, UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
    pdfUploader: f({
        pdf: {
            maxFileSize: "20MB",
        },
    })
        .middleware(async ({ req }) => {
            const user = await currentUser();

            if (!user) throw new UploadThingError("Unauthorized");

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.ufsUrl);

            return { userId: metadata.userId, file };
        }),
};
