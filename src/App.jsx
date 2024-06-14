import React from 'react'
import Case from './components/Case'

export default function App() {
  return (
    <Case>
    <div className='bg-gray-900 flex items-center justify-center min-h-screen'>
        <div className="bg-gray-800 border-t border-gray-600 shadow rounded-lg max-w-lg w-full p-6">
            <h4 className='text-white text-2xl'>Hello React</h4>
            <p className='text-lg text-gray-400 leading-relaxed'>A JavaScript library for building user interfaces</p>
        </div>
    </div>
    </Case>
  )
}