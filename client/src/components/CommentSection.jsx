/* eslint-disable react/prop-types */
//import React from 'react'
import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId }) {
    const { currentUser } = useSelector(state => state.user);
    const [comment, setComment] = useState('');
    const [ commentError, setCommentError] = useState(null);
    console.log(postId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            
            const res = await fetch('/api/comment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                }),
            });
            if (res.ok) {
                setComment('');
            } else {
                console.error('Failed to submit comment');
                setCommentError(null);
            }
        } catch (error) {
            setCommentError(error.message);
        }
    };

    return (
        <div className='max-w-2xl mx-auto w-full p-3 '>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt='' />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500 hover:underline'>
                        @{currentUser.username}
                    </Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    You must be logged in to Comment
                    <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign In</Link>
                </div>
            )}
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea
                        placeholder='Add a comment....'
                        rows='3'
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex justify-between items-center mt-5'>
                        <p className='text-gray-500 text-xs'>
                            {200 - comment.length} characters remaining
                        </p>
                        <Button type='submit' outline gradientDuoTone='purpleToBlue'>
                            Submit
                        </Button>
                    </div>
                    {commentError && (

                <Alert color='failure' className='mt-5'>
                    {commentError}
                </Alert>
                    )}
                </form>
            )}
        </div>
    );
}
