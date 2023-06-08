import React, { useRef, useState } from 'react'
import axios from '../config/axios'

const MergeVideo = () => {
  const preFileRef = useRef<HTMLVideoElement | null>(null)
  const inputFileRef = useRef<HTMLVideoElement | null>(null)

  const [preFile, setPreFile] = useState<File>()
  const [inputFile, setInputFile] = useState<File>()
  const [errorMsg, setErrorMsg] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const NEXT_PUBLIC_SUPABASE_VIDEO_URL = process.env.NEXT_PUBLIC_SUPABASE_VIDEO_URL


  const onChange = (e: React.ChangeEvent<HTMLInputElement>, ref: React.MutableRefObject<HTMLVideoElement | null>) => {
    const file = e.target.files?.item(0)
    if (file) {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        const src = fileReader.result as string

        if (ref.current) {
          ref.current.src = src
        }
      }
    }
  }

  const onSubmit = async (e: any) => {
    console.log('Processing...')
    setLoading(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('preFile', preFile as Blob)
    formData.append('inputFile', inputFile as Blob)

    try {
      setErrorMsg(null)
      setResult(null)
      const response = await axios.post('/api/merge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response)
      setResult(response?.data?.data?.fileName)
    } catch (err: any) {
      console.log(err)
      setErrorMsg(err.response?.data?.message || 'Some error occurred')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <form onSubmit={(e) => { onSubmit(e) }}>
        <div className='flex flex-col justify-center items-center'>
          <div className='py-8 w-full flex justify-center'>
            <div>
              <video className='h-64 my-8 mr-8 rounded-3xl ring-8 ring-emerald-400' ref={preFileRef} controls></video>
              <label className="block">
                <span>Upload first video file to join</span>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:transition-all file:cursor-pointer file:shadow-sm file:my-2"
                  accept='video/mp4'
                  onChange={(e) => { setPreFile(e.target.files?.[0]); onChange(e as React.ChangeEvent<HTMLInputElement>, preFileRef) }}
                  required
                />
              </label>
              <p className='ml-3'>{preFile ? Math.round(preFile.size / 1024 / 1024) + ' MB' : ''}</p>
            </div>

            <div>
              <video className='h-64 my-8 mr-8 rounded-3xl ring-8 ring-cyan-400' ref={inputFileRef} controls></video>
              <label className="block">
                <span>Upload second video file to join</span>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 file:transition-all file:cursor-pointer file:shadow-sm file:my-2"
                  accept='video/mp4'
                  onChange={(e) => { setInputFile(e.target.files?.[0]); onChange(e as React.ChangeEvent<HTMLInputElement>, inputFileRef) }}
                  required
                />
              </label>
              <p className='ml-3'>{inputFile ? Math.round(inputFile.size / 1024 / 1024) + ' MB' : ''}</p>
            </div>
          </div>

          <button
            className={`inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-full text-white bg-indigo-500 hover:bg-indigo-600 ease-in-out duration-150 transition-colors ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={loading}
          >
            {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            }
            {loading ? 'Processing...' : 'Merge Videos'}
          </button>

          <p className='text-pink-600 font-sm font-semibold max-w-2xl text-center mt-3'>{errorMsg}</p>
          <div className='text-emerald-600 font-sm font-semibold max-w-2xl text-center mt-3'>
            {loading && <ul className='list-disc marker:bg-emerald-800 animate-pulse text-lg'>
              <li>Trimming first 5 seconds ...</li>
              <li>Merging videos together ...</li>
              <li>Applying Watermark ...</li>
              <li>Uploading to cloud ...</li>
            </ul>}
            {result && <>
              {'Video processed successfully!'}
              {' '}
              <a
                className='underline uppercase font-bold text-emerald-700'
                target='_blank'
                href={encodeURI(`${NEXT_PUBLIC_SUPABASE_VIDEO_URL}/${result}`)}
              >
                View Result
              </a>
            </>
            }
          </div>
        </div>
      </form>

    </div>
  )
}

export default MergeVideo