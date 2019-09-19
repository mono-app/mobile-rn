import ImageResizer from 'react-native-image-resizer';
import { whileStatement } from '@babel/types';

export default class ImageCompress{

  static async compress(uri, imageSize){
    let response = null
    if(imageSize>300000){
      let sizeAfterCompress = imageSize
      let uriAfterCompress = uri
      let looping = 0
 
      while(sizeAfterCompress>300000){
        if(looping>7){
          break;
        }
        looping++
        try{
          const resp = await ImageResizer.createResizedImage(uriAfterCompress, 1280 ,720 , "JPEG", 90-looping, 0, null)
          response = resp
          sizeAfterCompress = resp.size
          uriAfterCompress = resp.uri

        } catch (err) {
          console(err);
        }
       
      }

    }else{
      const resp = await ImageResizer.createResizedImage(uri, 1280 ,720 , "JPEG", 100, 0, null)
      response = resp
    }
    return Promise.resolve(response)
  }
}