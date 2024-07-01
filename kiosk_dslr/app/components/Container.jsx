import React from 'react'

function Container({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
        {children}
    </div>
  )
}

export default Container
