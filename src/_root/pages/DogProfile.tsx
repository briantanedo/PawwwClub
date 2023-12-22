import GridPostList from "@/components/shared/GridPostList";
import OrangeLoader from "@/components/shared/OrangeLoader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
    useDeleteDog,
    useGetDogById,
} from "@/lib/react-query/queriesAndMutations";
import { Link, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import DogAbout from "./DogAbout";

interface StatBlockProps {
    value: string | number;
    label: string;
  }
  
  const StatBlock = ({ value, label }: StatBlockProps) => (
    <div className="flex-center gap-2">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-dark-3">{label}</p>
    </div>
  );

const DogProfile = () => {
    const { id } = useParams();
    const { data: dog, isPending } = useGetDogById(id || "");
    const { user } = useUserContext();
    const { mutate: deleteDog } = useDeleteDog();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleDeleteDog = () => {
        deleteDog({ dogId: id!, imageId: dog?.imageId });
        navigate(-1);
    };

    if (!dog || isPending)
    return (
      <div className="flex-center w-full h-full">
        <OrangeLoader />
      </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-inner_container">
                <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
                    <img
                        src={
                        dog.imageUrl || "/assets/icons/profile-placeholder.svg"
                        }
                        alt="profile"
                        className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
                    />
                    <div className="flex flex-col flex-1 justify-between md:mt-2">
                        <div className="flex flex-col w-full">
                        <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                            {dog.name}
                        </h1>
                        <div className="flex flex-row flex-center xl:justify-start">
                            <p className="line-clamp-1 text-xs text-dark-4 italic">{dog.breed}</p>
                            <p className="line-clamp-1 text-xs text-dark-4 italic">{dog.sex=='Female' ? ('♀') : ('♂')}</p>
                        </div>
                        </div>
                        <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
                        <StatBlock value={dog.posts.length} label="Posts" />
                        <StatBlock value={20} label="Followers" />
                        </div>

                        <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
                        {dog.bio}
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <div className={`${dog.keyOwner.$id !== user.id && "hidden"}`}>
                        <Link
                            to={`/update-profile/${dog.$id}`}
                            className={`h-12 bg-light-2 px-5 text-dark-1 flex-center gap-2 rounded-lg ${
                            user.id !== dog.keyOwner.$id && "hidden"
                            }`}>
                            <img
                            src={"/assets/icons/edit.svg"}
                            alt="edit"
                            width={20}
                            height={20}
                            />
                            <p className="flex whitespace-nowrap small-medium">
                            Edit Profile
                            </p>
                        </Link>
                        </div>
                        <div className={`${user.id === dog.keyOwner.$id && "hidden"}`}>
                            <Button type="button" className="shad-button_primary px-8">
                                Follow
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex max-w-5xl w-full">
                <Link
                    to={`/dogs/${id}`}
                    className={`profile-tab rounded-l-lg ${
                        pathname === `/dogs/${id}` && "!bg-light-3"
                }`}>
                    <img
                        src={"/assets/icons/posts.svg"}
                        alt="posts"
                        width={20}
                        height={20}
                    />
                    Posts
                </Link>
                <Link
                    to={`/dogs/${id}/about`}
                    className={`profile-tab rounded-r-lg
                        ${pathname === `/dogs/${id}/about` && "!bg-light-3"}
                `}>
                    <img
                        src={"/assets/icons/dog.svg"}
                        alt="dogs"
                        width={20}
                        height={20}
                    />
                    About
                </Link>
            </div>

            <Routes>
                <Route
                    index
                    element={<GridPostList posts={dog.posts} showUser={false} />}
                />
                <Route
                    path="/about"
                    element={<DogAbout />}
                />
            </Routes>

            <Outlet />

        </div>
    );
};

export default DogProfile;
