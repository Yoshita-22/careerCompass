// import React from 'react'

// function SaveBtn() {
//   return (
//     <>
//     <button
//         type="submit"
//         className="p-3 font-semibold gap-2 rounded-full shadow-md focus:outline-none hover:cursor-pointer bg-gradient-to-r from-rose-500 to-pink-400 text-white hover:from-rose-600 hover:to-pink-500"
//   > 
//          Save
//     </button>
    
//     </>
//   )
// }

// export default SaveBtn
import React from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useResume } from "../../AppContext/ResumeContext";

export default function SaveBtn() {
  const { getToken, userId } = useAuth();
  const { resumeTemplate } = useResume(); // 👈 This is your entire resume JSON

 

  return (
    <button
     
      className="p-3 font-semibold gap-2 rounded-full shadow-md focus:outline-none hover:cursor-pointer bg-gradient-to-r from-rose-500 to-pink-400 text-white hover:from-rose-600 hover:to-pink-500"
      type = "submit"
    >
      Save
    </button>
  );
}
