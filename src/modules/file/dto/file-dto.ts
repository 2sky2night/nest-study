export class FileDTO {
  readonly originalname: string;
  readonly encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}