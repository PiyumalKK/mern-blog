/* eslint-disable react/prop-types */
// PostCard.js

//import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="border border-teal-500 hover:border-2 group relative w-full h-[400px] overflow-hidden rounded-lg sm:w-[300px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img 
          src={post.image} 
          alt="post cover" 
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20" 
        />
      </Link>
      <div className="p-4 flex flex-col gap-2">
        <p className="text-xl font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <div className="text-gray-600 overflow-hidden max-h-[100px]" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        <div className="absolute bottom-0 left-0 right-0 border border-teal-500 text-teal-500 bg-white hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2 opacity-0 group-hover:opacity-100">
          <Link to={`/post/${post.slug}`} className="block py-2 px-4">
            Read Article
          </Link>
        </div>
      </div>
    </div>
  );
}
