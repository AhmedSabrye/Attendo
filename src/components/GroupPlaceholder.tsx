import { HiUserGroup } from "react-icons/hi2";

export default function GroupPlaceholder() {
  return ( 
    <div className="flex flex-col items-center justify-center h-full">
      <HiUserGroup className="text-4xl text-gray-400" />
      <h1 className="text-2xl font-bold text-gray-400">Select a group</h1>
    </div>  
  )
}
