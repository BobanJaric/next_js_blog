import { Toolbar } from '../components/toolbar';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head'
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import styles from '../styles/Home.module.css'
import moment from 'moment';


export default function Home({ posts }) {
  const router = useRouter();
  const [mappedPosts, setMappedPosts] = useState([]);
  const [projId, setProjId]=useState('');


  useEffect(() => {
    if (posts.length) {
      const imgBuilder = imageUrlBuilder({
        projectId: '',
        dataset: 'production',
      });

      setMappedPosts(
        posts.map(p => {
          return {
            ...p,
            mainImage: imgBuilder.image(p.mainImage).width(500).height(250),
          }
        })
      );
    } else {
      setMappedPosts([]);
    }
  }, [posts]);

 
  return (
    <React.Fragment>
      <Toolbar />
      <div className="flex flex-row flex-wrap md:flex-nowrap">
        <div className=" basis-3/4 grid place-items-center h-screen m-5">
        <p>Recent Posts : </p>
          {mappedPosts.length ? mappedPosts.map((p, index) => (
            <div onClick={() => router.push(`/post/${p.slug.current}`)} className="max-w-sm rounded overflow-hidden shadow-lg mb-5" key={index} >
              <img src={p.mainImage} className="w-fit" alt="Sunset in the mountains" />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{p.title}</div>
                <p className="text-gray-700 text-base">
                  {p.body[0].children[0].text}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Created: {moment(p._createdAt).format("dddd, MMMM Do YYYY")} </span>
              </div>
            </div>
          )) : <>No Posts Yet</>}
        </div>
        <div className='basis-1/4 m-10'>

        </div>
      </div>
  

      {/*  <div className="grid grid-cols-1 gap-4" >
        <div className="container mx-auto" >
          <h1 className="w-auto m-0 text-sm font-medium text-gray-900" >Welcome To My Blog</h1>
          <h3 className='w-auto m-0'>Recent Posts:</h3>
        </div>
        <div className="container mx-auto" >
          {mappedPosts.length ? mappedPosts.map((p, index) => (
            <div onClick={() => router.push(`/post/${p.slug.current}`)} key={index} className=" w-1/2 m-0 container mx-auto" >
              <h3 className='flex justify-center  ' >{p.title}</h3>
              <div className='flex justify-center  ' >
                <img src={p.mainImage} className='object-fill h-48 w-96 m-5' />
              </div>
            </div>
          )) : <>No Posts Yet</>}
        </div>
      </div> */}
    </React.Fragment >
  );
}

export const getServerSideProps = async pageContext => {
  const query = encodeURIComponent('*[ _type == "post" ]');
  const url = `https://.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then(res => res.json());

  if (!result.result || !result.result.length) {
    return {
      props: {
        posts: [],
      }
    }
  } else {
    return {
      props: {
        posts: result.result,
      }
    }
  }
}
