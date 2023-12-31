import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import DogTag from "./DogTag";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext();

    if(!post.creator) return;

    return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                    <img 
                    src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                    alt="creator" 
                    className="rounded-full w-10 h-10"
                    />
                </Link>
                <div className="flex flex-col">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <p className="base-medium lg:body-bold text-dark-1">
                            {post.creator.name}
                        </p>
                    </Link>
                    <div className="flex-center gap-2 text-dark-3">
                        <p className="subtle-semibold lg:small-regular">
                            {multiFormatDateString(post.$createdAt)}
                        </p>
                        -
                        <p className="subtle-semibold lg:small-regular">
                            {post.location}
                        </p>
                    </div>
                </div>
            </div>

            <Link to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"}`}>
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20}/>
            </Link>
        </div>

        <Link to={`/posts/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                <p>{post.caption}</p>
                <ul className={`flex gap-1 mt-2 ${post.tags == "" && "hidden"}`}>
                    {post.tags.map((tag: string) => (
                        <li key={tag} className="text-dark-4">
                            #{tag}
                        </li>
                    ))}
                </ul>
            </div>
            
            <img 
                src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                alt="post image" 
                className="post-card_img"/>
        </Link>
        {post.dogs.length > 0 ? 
        <div>
            <p className="small-medium">Featured Dogs:</p>
            <ul className="flex flex-start gap-2 py-2 pb-4">
                {post.dogs
                    ? post.dogs.map(
                    (dog:Models.Document) => (
                        <DogTag key={dog.$id} dog={dog}/>
                    ))
                : <></>}
            </ul>
        </div>
        :
        <></>
        }

        <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard