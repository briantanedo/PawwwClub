import HouseholdForm from "@/components/forms/HouseholdForm";
import { Button } from "@/components/ui/button";
import { useDeleteHousehold, useDeletePost } from "@/lib/react-query/queriesAndMutations";
import { useNavigate, useParams } from "react-router-dom";

const EditHousehold = () => {
    const { id } = useParams();
    const { mutate: deleteHousehold } = useDeleteHousehold();
    const navigate = useNavigate();
    
    const handleDeleteHousehold = () => {
      deleteHousehold( id! );
      navigate(-1);
    }
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <div className="w-full flex-start flex-row gap-2">
                <img
                    src="/assets/icons/add-post.svg"
                    width={36}
                    height={36}
                    alt="add"
                />
                <h2 className="h3-bold md:h2-bold text-left w-full">Edit Household!</h2>
            </div>
            <Button
                type="button"
                onClick={handleDeleteHousehold}
                className="shad-button_destructive whitespace-nowrap"
                >
                Delete Household
            </Button>
        </div>

        
        <HouseholdForm action="Update"/>
      </div>
    </div>
  )
}

export default EditHousehold