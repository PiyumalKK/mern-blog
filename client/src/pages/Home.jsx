// import React from 'react'
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getposts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Discover [Your Blog Name], where insightful articles, engaging stories,
          and expert advice on [topic/domain] await. Explore diverse topics,
          stay informed, and join a vibrant community of readers passionate about
          [specific aspects of your niche]. Start exploring today!
        </p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all Posts
        </Link>
      </div>
      <div className='p-3 bg-blue-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4 justify-center'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={'/search'} className='text-lg text-teal-500 hover:underline 
            text-center'>View all posts</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
