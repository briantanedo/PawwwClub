import { useUserContext } from "@/context/AuthContext"
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import PostForm from "../forms/PostForm";


const CreatePostCard = () => {
  const { user } = useUserContext();

  return (
    <div className="bg-light-1 rounded-xl border drop-shadow p-5 lg:p-7 w-full max-w-screen-sm">
      <div className="flex flex-row w-full h-10 gap-2">
        <div className="w-11">
          <Link to={`/profile/${user.id}`}>
              <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="creator"
              className="rounded-full flex w-10 h-10"
              />
          </Link>
        </div>
        <div className="flex w-full">
          <Dialog>
            <DialogTrigger className="flex-start w-full px-4 bg-light-2 hover:bg-light-3 rounded-full text-dark-4">
              What are your dogs up to, {user.name.split(" ")[0]}?
            </DialogTrigger>
            <DialogContent className="bg-light-1 h-4/5 w-full overflow-scroll">
              <p className="w-full flex flex-center h3-bold">Create Post</p>
              <hr></hr>
              <div className="flex items-center gap-3">
                <Link to={`/profile/${user.id}`}>
                    <img 
                    src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                    alt="user" 
                    className="rounded-full w-10 h-10"
                    />
                </Link>
                <div className="flex flex-col">
                    <Link to={`/profile/${user.id}`}>
                        <p className="base-medium lg:body-bold text-dark-1">
                            {user.name}
                        </p>
                    </Link>
                </div>
            </div>
              <PostForm action='Create'/>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

export default CreatePostCard