export class CreateMailDto {
  theme: string;
  receivers: number[];
  text: string;
  files: string[];
  photos: string[];
}
