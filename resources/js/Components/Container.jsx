import React from 'react'

export default function Container({children}) {
    return (
      <div className="p-2 mx-auto bg-white border rounded md:p-6">{children}</div>
    )
  }
