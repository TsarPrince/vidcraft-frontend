import type { NextPage } from 'next'
import React, { useState } from 'react'
import MergeVideo from '../components/MergeVideo'
import BottomNavbar from '../components/BottomNavbar'
import GetMetadata from '../components/GetMetadata'
import ViewBucket from '../components/ViewBucket'
import { supabase } from '../config/supabaseClient'
import Head from 'next/head'

type ActiveState = 'MergeVideo' | 'GetMetadata' | 'ViewBucket'
import { BucketItemsPageProps } from '../types/pageProps.type'

const Home: NextPage<BucketItemsPageProps> = ({ bucketItems }) => {
  const [activeState, setActiveState] = useState<ActiveState>('MergeVideo')

  return (
    <>
      <Head>
        <title>Vidcraft - Cloud Video Merger</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="Vidcraft - Cloud Video Merger" />
        <meta name="description" content="Vidcraft is a cloud video merger that allows you to merge two videos together seamlessly over the cloud." />
      </Head>
      <div className='max-h-[44rem] overflow-y-scroll'>
        {activeState === 'MergeVideo' && <MergeVideo />}
        {activeState === 'GetMetadata' && <GetMetadata />}
        {activeState === 'ViewBucket' && <ViewBucket bucketItems={bucketItems} />}
      </div>

      <BottomNavbar activeState={activeState} setActiveState={setActiveState} />
    </>
  )
}

export default Home

export const getServerSideProps = async () => {
  const { data, error } = await supabase.storage.from('video-bucket').list('', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  })
  if (error) console.log(error)
  return {
    props: {
      bucketItems: data
    }
  }
}
