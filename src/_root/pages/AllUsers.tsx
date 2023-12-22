import { useToast } from "@/components/ui/use-toast";
import OrangeLoader from "@/components/shared/OrangeLoader";
import UserCard from "@/components/shared/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { toast } = useToast();

  const { data: users, isLoading, isError: isErrorUsers } = useGetUsers();

  if (isErrorUsers) {
    toast({ title: "Something went wrong." });
    
    return;
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !users ? (
          <OrangeLoader />
        ) : (
          <ul className="user-grid">
            {users?.documents.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard currentUser={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;