import { Models } from 'appwrite'
import PostCard from './PostCard'

type PostCardListProps = {
  posts: Models.Document[],
}

const PostCardList = ({ posts }: PostCardListProps) => {

  return (
    <ul className="flex flex-col flex-1 gap-9 w-full">
    {posts.map((post) => (
      <PostCard post={post} key={post.$id}/>
    ))}
    </ul>
  )
}

export default PostCardList