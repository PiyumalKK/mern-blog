//import React from 'react'

import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className="flex  flex-col sm:flex-row p-3 border border-teal-500 
        justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col">
              <h2 className="text-2xl ">
                Want to join us ?
              </h2>
              <p className="text-gray-500 my-2">
                Checkout these resources with 100 other projects
              </p>
              <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none">
                     <a href="https://www.mywebsite.com" target='_blank'
                     rel='noopener noreferrer'>Learn More</a>
              </Button>
        </div>
        <div className="p-7 flex-1">
            <img src="https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="" />
        </div>
    </div>
  )
}
