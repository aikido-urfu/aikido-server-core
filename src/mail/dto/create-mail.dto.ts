export class CreateMailDto {
  theme: string;
  receivers: number[];
  text: string;
  files: {
    file: string;
    name: string;
    type: string;
  }[];
  photos: {
    file: string;
    name: string;
    type: string;
  }[];
}
