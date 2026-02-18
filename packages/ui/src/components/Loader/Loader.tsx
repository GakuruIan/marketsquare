import React from 'react'

import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from '../../lib/utils'

interface loaderProps {
    size?:'sm' | 'md' | 'lg',
    classname?: string;
}

const Loader:React.FC<loaderProps> = ({size='sm',classname}) => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <Spinner className={cn(
         size === "sm" && "size-4",
          size === "md" && "size-8",
          size === "lg" && "size-10",
          classname
      )}/>
    </div>
  )
}

export default Loader
