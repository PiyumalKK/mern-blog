/* eslint-disable react/no-unescaped-entities */
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//import React from 'react'
function SignUp() {

  const [formData, setformData] =useState({});

  const [errorMessage,setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();


  

  const handleChange = (e)=>{
    //console.log(e.target.value);
    setformData( {...formData, [e.target.id]: e.target.value.trim()})
  };
  //console.log(formData);
  const handleSubmit = async (e)=>{
    e.preventDefault();
    
    if(!formData.username || !formData.email || !formData.password )
      {
        return setErrorMessage('Please fill out all required fields');
      }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });
      // eslint-disable-next-line no-unused-vars
      const data =await res.json();

      if(data.success === false)
        {
          return setErrorMessage(data.message);
        }
      setLoading(false);

    if(res.ok)
      {
        navigate('/sign-in');
      }
    
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-8">
        {/*left*/}
        <div className="flex-1"> {/*Equal space*/}
        <Link to="/" className=" text-4xl font-bold dark:text-white">
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Piyumals's</span>
        Blog
    </Link>
    <p className='text-sm mt-5'>
      Welcome to my blog! You can sign up with your email and password or with your google account!
    </p>
        </div>
        <div className="flex-1">  {/*Equal space*/}
        {/*right*/}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="">
            <Label value='Your Username'/>
            <TextInput 
            type="text"
            placeholder="Username"
            id="username"onChange={handleChange}
            />
          </div>
          <div className="">
            <Label value='Your Email'/>
            <TextInput 
            type="email"
            placeholder="name@example.com"
            id="email" onChange={handleChange}
            />
          </div>
          <div className="">
            <Label value='Your Password'/>
            <TextInput 
            type="text"
            placeholder="Password"
            id="password"onChange={handleChange}
            />
          </div>
          <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
            {/*Sign Up*/}
            {
              loading ? (
                <>
                <Spinner size ='sm'/>
                <span className="pl-3">
                  Loading....
                </span>
                </>
                // as we are adding more than one html element inside the bracket we need to use <></>
                
              ) : 'Sign Up'
            }
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>
            Have an account already?
          </span>
          <Link to='/sign-in' className='text-blue-500'>
          Sign In
          </Link>
        </div>
        {
          errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default SignUp;