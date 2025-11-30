import React from 'react'

type Props = {children: React.ReactNode}

function layout({children}: Props) {
  return (
    <><section className='min-h-screen'>{children}</section></>
  )
}

export default layout