import React from 'react'
import { supabase } from '../config/supabaseClient'


type PageProps = {
  bucketItems: File[] | null
}

const NEXT_PUBLIC_SUPABASE_VIDEO_URL = process.env.NEXT_PUBLIC_SUPABASE_VIDEO_URL

const ViewBucket = ({ bucketItems }: PageProps) => {
  return (
    <div className='py-8 px-16'>

      <div className='border-2 rounded-xl overflow-x-scroll md:overflow-x-auto w-full'>
        <table className="table-auto text-left w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className='py-4 pr-6 text-slate-600 font-semibold pl-4'>#</th>
              <th className='py-4 pr-6 text-slate-600 font-semibold'>
                <span>Name</span>
                <svg className='inline flex-shrink-0 ml-2 mb-1 text-slate-600' fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z" /></svg>
              </th>
              <th className='py-4 pr-6 text-slate-600 font-semibold'>
                <span>Updated at</span>
                <svg className='inline flex-shrink-0 ml-2 mb-1 text-slate-600' fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" /></svg>
              </th>
              <th className='py-4 pr-6 text-slate-600 font-semibold'>
                <span>Created at</span>
                <svg className='inline flex-shrink-0 ml-2 mb-1 text-slate-600' fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" /></svg>
              </th>
              <th className='py-4 pr-6 text-slate-600 font-semibold'>
                <span>Size</span>
                <svg className='inline flex-shrink-0 ml-2 mb-1 text-slate-600' fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M224 96a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm122.5 32c3.5-10 5.5-20.8 5.5-32c0-53-43-96-96-96s-96 43-96 96c0 11.2 1.9 22 5.5 32H120c-22 0-41.2 15-46.6 36.4l-72 288c-3.6 14.3-.4 29.5 8.7 41.2S33.2 512 48 512H464c14.8 0 28.7-6.8 37.8-18.5s12.3-26.8 8.7-41.2l-72-288C433.2 143 414 128 392 128H346.5z" /></svg>
              </th>
              <th className='py-4 pr-6 text-slate-600 font-semibold'>
                <span>Mime Type</span>
                <svg className='inline flex-shrink-0 ml-2 mb-1 text-slate-600' fill='currentColor' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M114.57,76.07a45.71,45.71,0,0,0-67.51-6.41c-17.58,16.18-19,43.52-4.75,62.77l91.78,123L41.76,379.58c-14.23,19.25-13.11,46.59,4.74,62.77A45.71,45.71,0,0,0,114,435.94L242.89,262.7a12.14,12.14,0,0,0,0-14.23ZM470.24,379.58,377.91,255.45l91.78-123c14.22-19.25,12.83-46.59-4.75-62.77a45.71,45.71,0,0,0-67.51,6.41l-128,172.12a12.14,12.14,0,0,0,0,14.23L398,435.94a45.71,45.71,0,0,0,67.51,6.41C483.35,426.17,484.47,398.83,470.24,379.58Z" /></svg>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              bucketItems?.map((bucket, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2 pr-12 pl-4">{index + 1}</td>
                  <td className="py-2 pr-12 whitespace-nowrap">
                    <a
                      className='hover:underline hover:text-indigo-600 font-semibold flex items-center space-x-2'
                      target='_blank'
                      href={encodeURI(`${NEXT_PUBLIC_SUPABASE_VIDEO_URL}/${bucket.name}`)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="#f73f3f"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" /></svg>
                      <span>{bucket.name ?? '-'}</span>
                    </a>
                  </td>
                  <td className="py-2 pr-12 whitespace-nowrap">{bucket.updated_at ?? '-'}</td>
                  <td className="py-2 pr-12 whitespace-nowrap">{bucket.created_at ?? '-'}</td>
                  <td className="py-2 pr-12 whitespace-nowrap">{(bucket.metadata.size / 1024 / 1024).toFixed(2) + ' MB' ?? '-'}</td>
                  <td className="py-2 pr-12 whitespace-nowrap">{bucket.metadata.mimetype ?? '-'}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default ViewBucket

