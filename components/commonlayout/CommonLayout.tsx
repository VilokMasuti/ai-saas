import Loading from '@/app/Loading';

import React from 'react'
import {  ReduxProvider } from "../../provider/index";
import { Suspense } from "react";

const CommonLayout =  async({children}:any) => {
  return (
   <ReduxProvider>
    <Suspense fallback={<Loading/>}> {children} </Suspense>
   </ReduxProvider> 
  )
}

export default CommonLayout
