import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
    const { data: currentUser } = useGetUserById(user.id || "");
    const userIsCurrentUser = user.id === currentUser?.id
    console.log(userIsCurrentUser)
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-dark-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-dark-4 text-center line-clamp-1">
          @{user.username}
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