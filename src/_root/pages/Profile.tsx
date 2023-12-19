import GridDogList from '@/components/shared/GridDogList';
import OrangeLoader from '@/components/shared/OrangeLoader';
import { useUserContext } from '@/context/AuthContext';
import { useGetUserById, useGetUserDogs } from '@/lib/react-query/queriesAndMutations';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { data: dogsData } = useGetUserDogs(id);
  const dogs = dogsData?.documents;
  
  const { data: currentUser } = useGetUserById(id || "");

  const isOwnProfile = id === user.id;
  console.log(currentUser?.pets);
  console.log(dogs)

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <OrangeLoader />
      </div>
    );

  /* const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data :searchedPosts, isFetching: isSearchFetching } = useSearchDogs(debouncedSearch);
 */

  if(!dogs) {
    console.log('no dogs');
    return (
      <div className="flex-center w-full h-full">
        <p className="text-light-4 mt-10 text-center w-full">User has no dogs</p>
      </div>
    )
  }

  /* const shouldShowSearchResults = searchValue !== "";
  const shouldShowDogs = !shouldShowSearchResults && dogs.pages.every((item) => item?.documents.length === 0)
 */
  return (
    <div className="explore-container">
      <h2 className="h3-bold md:h2-bold w-full">{currentUser.name}</h2>
      {/* <div className="explore-inner_container">
        <div className="flex gap-1 px-4 w-full rounded-lg bg-light-2">
          <img 
            src="/assets/icons/search.svg" 
            width={24}
            height={24}
            alt="search" 
          />
          <Input 
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div> */}

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        
        <h3 className="body-bold md:h3-bold">Dogs</h3>
        
        <div className="flex-center gap-3 bg-light-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-dark-2">All</p>

          <img 
            src="/assets/icons/filter.svg" 
            alt="filter"
            width={20}
            height={20}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        <GridDogList dogs={currentUser.pets} showUser={!isOwnProfile}/>
      </div>
    </div>
  )
}

export default Profile