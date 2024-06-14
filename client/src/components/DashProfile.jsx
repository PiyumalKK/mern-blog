/* eslint-disable react/no-unescaped-entities */
// import React from 'react'
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput, Modal} from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure,deleteUserFailure,
  deleteUserStart, deleteUserSuccess, signoutSuccess
 } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle} from 'react-icons/hi';
import { Link } from 'react-router-dom'; 


export default function DashProfile() {
  const { currentUser, error, loading } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(currentUser.profilePicture);

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess,setupdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [showModal, setShowModel] = useState(false);

  const [formData, setFormData] = useState({});

  //console.log(imageFileUploadProgress, imageFileUploadError);

  const filePickerRef = useRef();

  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const uploadImage = async () => {
    /*
      service firebase.storage {
        match /b/{bucket}/o {
          match /{allPaths=**} {
            allow read;
            allow write: if
            request.resource.size < 2*1024*1024 &&
            request.resource.contentType.matches('image/.*')
          }
        }
      }
    */

    // console.log("uploading image........")
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setImageFileUploadError("Couldn't upload. File must be less than 2 MB");
        setImageFileUrl(currentUser.profilePicture); // Reset to current profile picture
      setImageFileUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
      },

      
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData, profilePicture: downloadURL});
          setImageFileUploading(false);
        });
        setImageFileUploadProgress(null);
      }
    );
  };

  const handleChange = (e) => {
      setFormData({...formData, [e.target.id]: e.target.value});
  }
  
   //console.log(formData);
   const handleSubmit = async (e) => {
       e.preventDefault();
       setUpdateUserError(null);
       setupdateUserSuccess(null);
       if(Object.keys(formData).length === 0)
        {
          setUpdateUserError("No Changes were made");
          return;
        }

        if(imageFileUploading)
          {
            setUpdateUserError("Please wait for the image file upload")
            return;
          }

      try {
         dispatch(updateStart());
         const res = await fetch(`/api/user/update/${currentUser._id}`,{
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
         });
         const data = await res.json();
         if(!res.ok)
          {
            dispatch(updateFailure(data.message));
            setUpdateUserError(data.message);
          }
          else
          {
            dispatch(updateSuccess(data));
            setupdateUserSuccess("User's profile has been updated")
          }
      } catch (error) {
        dispatch(updateFailure(error.message));
       setUpdateUserError(error.message);
      }

   };

   const handleDeleteUser = async () => {
     setShowModel(false);
     try {
         dispatch(deleteUserStart());
         const res = await fetch(`api/user/delete/${
          currentUser._id}`,
          {
          method: 'DELETE',


          
          }
         );
         const data = await res.json();
         
         if(!res.ok)
          {
            dispatch(deleteUserFailure(data.message));
          }
          else{
            dispatch(deleteUserSuccess(data));
          }

     } catch (error) {
       dispatch(deleteUserFailure(error.message));
     }

   };

   const handleSignout = async () => {
         try {
             const res = await fetch('/api/user/signout', {
              method: 'POST',
             });
             const data = await res.json();
             if(!res.ok)
              {
                console.log(data.message);

              }
              else{
                 dispatch(signoutSuccess());
              }
         } catch (error) {
             console.log(error.message);
         }
   }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress || 0}
            text={`${imageFileUploadProgress}%`} 
            strokeWidth={5}
            styles={{
              root:{
                width:'100%',
                height:'100%',
                position:"Absolute",
                top:'0',
                left:'0',
              },
              path: {
                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
              },
            }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress && imageFileUploadProgress < 100 ? 'opacity-60' : ''
            }`}
            
          />
        </div>

    {imageFileUploadError && (
        <Alert color='failure'>
           {imageFileUploadError}
        </Alert>

    )
    }

        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username} onChange={handleChange}
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email} onChange={handleChange}
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password' onChange={handleChange}
        />

        <Button type='submit' gradientDuoTone='purpleToBlue' outline 
        disabled={loading || imageFileUploading}>
          {loading ? 'Loading...' : 'Update'}
        </Button>
        {
  currentUser.isAdmin && (
    <Link to={'/create-post'}>
      <Button 
        type='button'
        gradientDuoTone='purpleToPink'
        className='w-full'
      >
        Create a Post
      </Button>
    </Link>
  )
}



      </form>

      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setShowModel(true)} className='cursor-pointer'>
          Delete Account
        </span>
        <span onClick={handleSignout} className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}

{error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}

     <Modal show={showModal} onClose={()=>setShowModel(false)} 
     popup size='md'>
      <Modal.Header/>
        <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
               dark:text-gray-200 mb-4 mx-auto'/>
               <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete your account
               </h3>
              
              <div className='flex justify-center gap-5'>
                <Button color='failure' onClick={handleDeleteUser}>
                  Yes, I'm Sure
                </Button>

                <Button color='gray' onClick={()=>setShowModel(false)}>
                  No, Cancel
                </Button>
              </div>
               

            </div>
        </Modal.Body>
      

     </Modal>

    </div>
  );
}
