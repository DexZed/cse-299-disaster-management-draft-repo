import React from 'react'

type Props = {children: React.ReactNode}

function layout({children}: Props) {
  return (
    <><section>{children}</section></>
  )
}

export default layout