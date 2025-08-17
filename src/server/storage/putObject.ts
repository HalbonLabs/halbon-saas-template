// src/server/storage/putObject.ts
import { getProvider } from "@/config";

export async function putObject(_key: string, _data: Buffer | Uint8Array) {
  const storage = getProvider("storage");

  switch (storage.provider) {
    case "aws_s3": {
      // const s3 = new S3Client({
      //   region: storage.region!,
      //   credentials: { accessKeyId: storage.accessKeyId!, secretAccessKey: storage.secretAccessKey! },
      // });
      // await s3.send(new PutObjectCommand({ Bucket: storage.bucket!, Key: key, Body: data }));
      return { ok: true, provider: "aws_s3" } as const;
    }
    case "dummy":
    default:
      return { ok: true, provider: "dummy" } as const;
  }
}
