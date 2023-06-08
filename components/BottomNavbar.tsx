import React, { Dispatch } from 'react'

type ActiveState = 'MergeVideo' | 'GetMetadata' | 'ViewBucket'

type propType = {
  activeState: ActiveState,
  setActiveState: Dispatch<ActiveState>
}

const BottomNavbar = ({ activeState, setActiveState }: propType) => {
  return (
    <div className='flex items-center justify-center space-x-6 absolute bottom-12 left-1/2 -translate-x-1/2'>
      <button
        onClick={() => setActiveState('MergeVideo')}
        className={`px-6 py-6 md:px-28 md:py-14 flex items-center justify-center space-x-2 ${activeState === 'MergeVideo' ? 'bg-pink-500 shadow-pink-700' : 'bg-indigo-500 shadow-[#373ab3]'} text-white rounded-3xl md:rounded-[2rem] text-xl shadow-[10px_10px_0_0] hover:translate-x-[10px] hover:translate-y-[10px] hover:shadow-none transition`}>
        <svg className='flex-shrink-0' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill='white'><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" /></svg>
        <span className='hidden md:block flex-shrink-0'>Merge Videos</span>
      </button>
      <button
        onClick={() => setActiveState('GetMetadata')}
        className={`px-6 py-6 md:px-28 md:py-14 flex items-center justify-center space-x-2 ${activeState === 'GetMetadata' ? 'bg-pink-500 shadow-pink-700' : 'bg-indigo-500 shadow-[#373ab3]'} text-white rounded-3xl md:rounded-[2rem] text-xl shadow-[10px_10px_0_0] hover:translate-x-[10px] hover:translate-y-[10px] hover:shadow-none transition`}>
        <svg className='flex-shrink-0' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill='white'><path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" /></svg>
        <span className='hidden md:block flex-shrink-0'>Get Metadata</span>
      </button>
      <button
        onClick={() => setActiveState('ViewBucket')}
        className={`px-6 py-6 md:px-28 md:py-14 flex items-center justify-center space-x-2 ${activeState === 'ViewBucket' ? 'bg-pink-500 shadow-pink-700' : 'bg-indigo-500 shadow-[#373ab3]'} text-white rounded-3xl md:rounded-[2rem] text-xl shadow-[10px_10px_0_0] hover:translate-x-[10px] hover:translate-y-[10px] hover:shadow-none transition`}>
        <svg className='flex-shrink-0' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512" fill='white'><path d="M96 152v8H48v-8C48 68.1 116.1 0 200 0h48c83.9 0 152 68.1 152 152v8H352v-8c0-57.4-46.6-104-104-104H200C142.6 48 96 94.6 96 152zM0 224c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32h-5.1L388.5 469c-2.6 24.4-23.2 43-47.7 43H107.2c-24.6 0-45.2-18.5-47.7-43L37.1 256H32c-17.7 0-32-14.3-32-32z" /></svg>
        <span className='hidden md:block flex-shrink-0'>View bucket</span>
      </button>
    </div>
  )
}

export default BottomNavbar