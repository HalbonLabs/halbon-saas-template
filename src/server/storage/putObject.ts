// src/server/storage/putObject.ts
import { getProvider } from "@/config";

export async function putObject(_key: string, _data: Buffer | Uint8Array) {
  const storage = getProvider("storage");

  switch (storage.provider) {
    case "aws_s3": {
      // TODO: Implement S3Client integration
      // Import S3Client from @aws-sdk/client-s3 and implement putObject
      return { ok: true, provider: "aws_s3" } as const;
    }
    case "dummy":
    default:
      return { ok: true, provider: "dummy" } as const;
  }
}
