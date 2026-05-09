"use client"
import {useState, React} from 'react';

export default function ReviewCard({navValue}:{navValue:string}) {
  switch (navValue){
    case "Description":
        return(<div>
            Description
            This is the description
        </div>)
       

    case "Ingredients":
        return(<div>
            Ingredients
            This is the ingredients
        </div>)
        
    case "How To Use":
        return(<div>
            How To Use
            This is the How To Use
        </div>)
        
      case "Review":
        return(<div>
            Review
            This is the Review
        </div>)
        
      default:
          return <p>No Content</p>
  }

}
