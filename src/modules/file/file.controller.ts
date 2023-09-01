import { Controller, UploadedFiles, UploadedFile, UseInterceptors, Get, Req, Res } from "@nestjs/common";
import { Post } from "@nestjs/common";
import { FilesInterceptor, FileInterceptor, FileFieldsInterceptor, MulterModule } from '@nestjs/platform-express'
import { FileDTO } from "./dto/file-dto";
import { createReadStream, writeFileSync, } from 'fs'
import { resolve } from 'path'
import { Response } from "express";

@Controller('file')
export class FileController {
  // 单字段单文件
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: FileDTO) {
    const rootPath = resolve('./src/static/file')
    // 直接保存
    writeFileSync(resolve(rootPath, `./${file.originalname}`), file.buffer)
    // 通过流式保存文件
    // const fileStream = createWriteStream(resolve(rootPath, `./${file.originalname}`))
    // await new Promise<void>(r => {
    //   fileStream.write(file.buffer, () => {
    //     // 文件流保存成功的回调
    //     r()
    //   })
    // })
    return 'ok'
  }
  // 单字段多文件
  @Post('/uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFiles(@UploadedFiles() files: FileDTO[]) {
    console.log(files);
    return 'ok'
  }
  // 多个文件
  @Post('/uploadFields')
  @UseInterceptors(FileFieldsInterceptor([
    // name为字段铭，maxCount：字段值的数量
    { name: 'avatar', maxCount: 1 },
    { name: 'background', maxCount: 1 },
  ]))
  uploadFields(@UploadedFiles() files: { avatar: FileDTO, background: FileDTO }) {
    console.log(files);
    return 'ok'
  }
  // 文件下载(直接下载)
  @Get('/download')
  async downloadFile(@Res() res: Response) {
    const rootPath = resolve('./src/static/file')
    // filename为下载时的文件名称
    res.setHeader('Content-Disposition', "attachment;filename=" + '1.png')
    //第二个参数配置项 highWaterMark 最高水位线,默认最多读取64K,这里设置每次读取1b
    const fileStream = createReadStream(resolve(rootPath, './1.png'), { highWaterMark: 1 })
    const buffer = await new Promise<Buffer>(r => {
      // 保存buffer流片段
      const arrBuffer: Buffer[] = []
      fileStream.on('data', (chunk: Buffer) => {
        // 以流的方式读取文件，每次读取保存一段数据
        console.log(chunk.length);
        
        arrBuffer.push(chunk)
      })
      fileStream.on('end', () => {
        // 文件读取完成，合并数据
        r(Buffer.concat(arrBuffer))
      })

    })
    return res.send(buffer)
  }
}