import React from "react";

import ContentLoader from 'rn-content-loader'
import { Rect } from 'react-native-svg'

function Loading(){
  return (
    <ContentLoader height={50}>
      <Rect x={86} y={16} rx="4" ry="4" width={150} height={12}/>
    </ContentLoader>
  )
}
export default Loading;