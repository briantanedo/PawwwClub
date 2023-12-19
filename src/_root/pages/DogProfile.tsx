import OrangeLoader from "@/components/shared/OrangeLoader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
    useDeleteDog,
    useGetDogById,
} from "@/lib/react-query/queriesAndMutations";
import { Link, useNavigate, useParams } from "react-router-dom";

const DogProfile = () => {
    const { id } = useParams();
    const { data: dog, isPending } = useGetDogById(id || "");
    const { user } = useUserContext();
    const { mutate: deleteDog } = useDeleteDog();
    const navigate = useNavigate();

    const handleDeleteDog = () => {
        deleteDog({ dogId: id!, imageId: dog?.imageId });
        navigate(-1);
    };

    return (
        <div className="post_details-container">
            {isPending ? (
                <OrangeLoader />
            ) : (
                <div className="post_details-card">
                    <img src={dog?.imageUrl} alt="dog" className="post_details-img" />

                    <div className="post_details-info">
                        <div className="flex flex-between w-full">
                            <div className="flex flex-row w-full items-baseline">
                                <p className="base-medium body-bold text-dark-1 pr-2">
                                    {dog?.name}
                                </p>
                                <p className="line-clamp-1 text-xs text-dark-4 italic">
                                    {dog?.breed}
                                </p>
                                <p className="line-clamp-1 text-xs text-dark-4 italic">
                                    {dog?.sex == "Female" ? "♀" : "♂"}
                                </p>
                            </div>
                            <div className="flex-center content-end">
                                <Link
                                    to={`/update-dog/${dog?.$id}`}
                                    className={`${user.id !== dog?.keyOwner.$id && "hidden"}`}
                                >
                                    <img
                                        src="/assets/icons/edit.svg"
                                        alt="edit"
                                        width={24}
                                        height={24}
                                    />
                                </Link>
                                <Button
                                    onClick={handleDeleteDog}
                                    variant="ghost"
                                    className={`ghost_details-delete_btn ${user.id !== dog?.keyOwner.$id && "hidden"
                                        }`}
                                >
                                    <img
                                        src="/assets/icons/delete.svg"
                                        alt="delete"
                                        width={24}
                                        height={24}
                                    />
                                </Button>
                            </div>
                        </div>

                        <hr className="border w-full border-light-2/80"></hr>

                        <div className="flex flex-col flex-1 w-full small-medium lg:base-medium">
                            <p>{dog?.bio}</p>
                        </div>
                        <Link
                            to={`/profile/${dog?.keyOwner.$id}`}
                            className="flex items-center gap-3"
                        >
                            <img
                                src={
                                    dog?.keyOwner?.imageUrl ||
                                    "/assets/icons/profile-placeholder.svg"
                                }
                                alt="creator"
                                className="rounded-full w-4 h-4 lg:w-6 lg:h-6"
                            />

                            <div className="flex flex-col">
                                <Link to={`/profile/${dog?.keyOwner.$id}`}>
                                    <p className="base-medium lg:body-bold text-dark-1">
                                        {dog?.keyOwner.name}
                                    </p>
                                </Link>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DogProfile;
