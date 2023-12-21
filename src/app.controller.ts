import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // getFile(@Param('id') id: string) {
  //   return this.appService.getFile(id);
  // }

  @Get('/uploads/:id')
  getImage(@Param('id') id: string, @Res() res) {
    const imagePath = this.appService.getFile(id);
    res.sendFile(imagePath);
  }
}
