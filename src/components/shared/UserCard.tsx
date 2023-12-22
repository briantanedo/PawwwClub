import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext";

type UserCardProps = {
  currentUser: Models.Document;
};

const UserCard = ({ currentUser }: UserCardProps) => {
    const { user } = useUserContext();
    const userIsCurrentUser = user.id === currentUser.$id
    console.log(userIsCurrentUser)
  return (
    <Link to={`/profile/${currentUser.$id}`} className="user-card">
      <img
        src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-dark-1 text-center line-clamp-1">
          {currentUser.name}
        </p>
        <p className="small-regular text-dark-4 text-center line-clamp-1">
          @{currentUser.username}
        </p>
      </div>
        {userIsCurrentUser ?
        <Button type="button" size="sm" className="shad-button_dark_4 px-5" disabled={true}>
          You
        </Button>
        : 
        <Button type="button" size="sm" className="shad-button_primary px-5">
          Follow
        </Button>
        }
    </Link>
  );
};

export default UserCard;