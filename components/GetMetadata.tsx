import React, { useRef, useState } from 'react'
import axios from '../config/axios'
import Ffmpeg from 'fluent-ffmpeg'
import { supabase } from '../config/supabaseClient'

const MergeVideo = () => {
  const inputFileRef = useRef<HTMLVideoElement | null>(null)
  const [inputFile, setInputFile] = useState<File>()
  const [metadata, setMetadata] = useState<Ffmpeg.FfprobeData | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [fileUploadMsg1, setFileUploadMsg1] = useState<string | null>(null)
  const [id1, setId1] = useState<string | null>(null)


  const onChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    ref: React.MutableRefObject<HTMLVideoElement | null>,
    setState: React.Dispatch<React.SetStateAction<string | null>>,
    setId: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
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

      console.log('Uploading file')
      setState('Uploading file, please wait...')
      const { data, error } = await supabase.storage.from('video-bucket').upload(Date.now() + '-' + file.name, file)

      if (error) {
        console.log(error)
        setState(error?.message || 'File upload failed')

      } else {

        setState('Fetching file ID...')
        console.log('Fetching file ID')
        const { data: filesData, error: listError } = await supabase.storage.from('video-bucket').list()

        if (listError) {
          console.log(listError)
          setState(listError?.message || 'Fetching file id failed')
        }

        filesData?.forEach((file) => {
          if (file.name === data?.path) {
            setState(file.id)
            setId(file.id)
          }
        })
      }
    }
  }

  const onSubmit = async (e: any) => {
    console.log('Processing...')
    setLoading(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append('video', inputFile as Blob)

    try {
      if (!id1) {
        setErrorMsg('Please ensure file is uploaded before fetching metadata')
        return
      }
      setErrorMsg(null)
      setResult(null)
      setMetadata(null)
      const response = await axios.post('/api/getMetaData', { id: id1 })
      console.log(response)
      setResult(response?.data?.message)
      const metadata: Ffmpeg.FfprobeData = response?.data?.data
      setMetadata(metadata)
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
              <video className='h-64 my-8 mr-8 rounded-3xl ring-8 ring-cyan-400' ref={inputFileRef} controls></video>
              <label className="block">
                <span>Upload video file to fetch Meta Data</span>
                <input
                  type="file"
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 file:transition-all file:cursor-pointer file:shadow-sm file:my-2"
                  accept='video/mp4'
                  onChange={(e) => { setInputFile(e.target.files?.[0]); onChange(e as React.ChangeEvent<HTMLInputElement>, inputFileRef, setFileUploadMsg1, setId1) }}
                  required
                />
              </label>
              <p className='ml-3'>{inputFile ? Math.round(inputFile.size / 1024 / 1024) + ' MB' : ''}</p>
              <p className='ml-3'>{fileUploadMsg1}</p>
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
            {loading ? 'Processing...' : 'Get Metadata'}
          </button>

          <p className='text-pink-600 font-sm font-semibold max-w-2xl text-center mt-3'>{errorMsg}</p>
          <p className='text-emerald-600 font-sm font-semibold max-w-2xl text-center mt-3'>
            {result && <span>{result}</span>}
          </p>
        </div>
      </form>


      <div className='flex flex-col items-center space-y-12 mt-4'>

        {metadata && <div className='border-2 rounded-xl overflow-x-scroll md:overflow-x-auto w-[90%]'>
          <table className="table-auto text-left w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className='py-4 pr-6 text-slate-600 font-semibold pl-4'>bit_rate</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>duration</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>format_long_name</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>format_name</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>probe_score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.format?.bit_rate ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.format?.duration ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.format?.format_long_name ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.format?.format_name ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.format?.probe_score ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>}
        {metadata && <div className='border-2 rounded-xl overflow-x-scroll md:overflow-x-auto w-[90%]'>
          <table className="table-auto text-left w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className='py-4 pr-6 text-slate-600 font-semibold pl-4'>avg_frame_rate</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>bit_rate</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>bits_per_raw_sample</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>chroma_location</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>closed_captions</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_long_name</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_name</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_tag</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_tag_string</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_type</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>coded_height</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>coded_width</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>display_aspect_ratio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.avg_frame_rate ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.bit_rate ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.bits_per_raw_sample ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.chroma_location ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.closed_captions ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.codec_long_name ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.codec_name ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.codec_tag ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.codec_tag_string ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.codec_type ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.coded_height ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.coded_width ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[0]?.display_aspect_ratio ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>}
        {metadata && <div className='border-2 rounded-xl overflow-x-scroll md:overflow-x-auto w-[90%]'>
          <table className="table-auto text-left w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className='py-4 pr-6 text-slate-600 font-semibold pl-4'>avg_frame_rate</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>bit_rate</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>bits_per_raw_sample</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>channel_layout</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>channels</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_long_name</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_name</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_tag</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_tag_string</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>codec_type</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>duration</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>duration_ts</th>
                <th className='py-4 pr-6 text-slate-600 font-semibold'>extradata_size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.avg_frame_rate ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.bit_rate ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.bits_per_raw_sample ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.channel_layout ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.channels ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.codec_long_name ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.codec_name ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.codec_tag ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.codec_tag_string ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.codec_type ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.duration ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.duration_ts ?? '-'}</td>
                <td className="py-2 pr-12 whitespace-nowrap">{metadata?.streams?.[1]?.extradata_size ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>}
      </div>

    </div>
  )
}

export default MergeVideo