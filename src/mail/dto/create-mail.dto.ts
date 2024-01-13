export class CreateMailDto {
  theme: string;
  receivers: number[];
  text: string;
  files: number[];
  photos: string[];
}
