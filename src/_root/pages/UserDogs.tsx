import GridDogList from '@/components/shared/GridDogList';
import OrangeLoader from '@/components/shared/OrangeLoader';
import { useUserContext } from '@/context/AuthContext';
import { useGetUserById, useGetUserDogs, useGetUserHouseholds } from '@/lib/react-query/queriesAndMutations';
import { Link } from 'react-router-dom';

type UserDogsProps = {
    userId: string,
    showUser?: boolean;
  }

const UserDogs = ({ userId, showUser = true}: UserDogsProps) => {
    const { user } = useUserContext();
    const { data: currentUser } = useGetUserById(userId || "");

    if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <OrangeLoader />
      </div>
    );

    const { data: dogs } = useGetUserDogs(currentUser.$id);
    const { data: households } = useGetUserHouseholds(currentUser.$id);

    if(!dogs) {
        return (
        <div className="flex-center w-full h-full">
            User has no dogs.
        </div>
        )
    }

  return (
    <div className="w-full h-full">
      <div className="flex-between w-full max-w-5xl mb-2">
        <div className="flex flex-col w-full gap-2 items-baseline">
            <div className="flex flex-row flex-center w-full max-w-5xl mb-2">
                <h3 className="flex body-bold h2-bold w-full">{currentUser.name}'s Dogs</h3>
                <div className="flex flex-center gap-3 bg-light-3 rounded-xl px-4 py-2 cursor-pointer">
                <p className="small-medium md:base-medium text-dark-2">All</p>

                <img 
                    src="/assets/icons/filter.svg" 
                    alt="filter"
                    width={20}
                    height={20}
                />
                </div>
            </div>
            {user.id === userId ?
            <div className="flex flex-wrap gap-2">
                <Link to="/create-household/" className="text-primary-500 hover:bg-light-2 p-1 border-[1px] border-primary-500 rounded-xl">
                    Create Household
                </Link>
                <Link to="/create-dog/" className="text-primary-500 hover:bg-light-2 p-1 border-[1px] border-primary-500 rounded-xl">
                    Add Dog
                </Link>
            </div>
            :
            <></>
            }
        </div>
        
        
      </div>
      
      <div className="flex flex-wrap gap-9 w-full max-w-5xl" key={userId}>
        {households?.documents.map((household) => (
        <div className="flex flex-col">
            <div className="flex flex-row gap-2">
                <h3 className="h4-bold py-2 text-dark-3">{household.name}</h3>
                <div className="flex-center content-end">
                    <Link
                        to={`/update-household/${household.$id}`}
                        className={`${user.id !== household.creator.$id && "hidden"}`}
                    >
                        <img
                            src="/assets/icons/edit.svg"
                            alt="edit"
                            width={24}
                            height={24}
                        />
                    </Link>
                </div>
            </div>
            <GridDogList dogs={household.dogs} showUser={showUser}/>
        </div>
        ))}
      </div>
    </div>
  )
}

export default UserDogs