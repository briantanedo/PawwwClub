/* import { useUserContext } from '@/context/AuthContext'
 */import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
/* import PostStats from './PostStats';
 */
type GridPostListProps = {
  dogs: Models.Document[],
  showUser?: boolean;
  showStats?: boolean;
}

const GridDogList = ({ dogs, showUser = true /* showStats = true */ }: GridPostListProps) => {
  /* const { user } = useUserContext(); */

  return (
    <ul className="grid-container">
      {dogs.map((dog) => (
        <li key={dog.$id} className="relative min-w-80 g-80">
          <Link to={`/dogs/${dog.$id}`} className="grid-post_link">
            <img src={dog.imageUrl} alt="post" className="h-full w-full object-cover"/>
          </Link>

          <div className="grid-post_user text-light-1">
            <div className="flex items-baseline justify-start gap-0 flex-1">
              <p className="line-clamp-1 text-xl pr-2">{dog.name}</p>
              <p className="line-clamp-1 text-xs text-light-4 italic">{dog.breed}</p>
              <p className="line-clamp-1 text-xs text-light-4 italic">{dog.sex=='Female' ? ('♀') : ('♂')}</p>
            </div>
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img src={dog.keyOwner.imageUrl} alt="creator" className="h-8 w-8 rounded-full"/>
                <p className="line-clamp-1">{dog.keyOwner.name}</p>
              </div>
            )}
            {/* {showStats && <PostStats post={post} userId={user.id}/>} */}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default GridDogList