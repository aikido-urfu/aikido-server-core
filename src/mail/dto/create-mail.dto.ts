export class CreateMailDto {
  theme: string;
  recievers: number[];
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
