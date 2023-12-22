import { Models } from "appwrite";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useNavigate } from "react-router-dom";


type DogTagProps = {
  dog: Models.Document;
};

const DogTag = ({ dog }: DogTagProps) => {
  const navigate = useNavigate();

  return (
    <HoverCard>
    <HoverCardTrigger onClick={(e) => 
      {e.stopPropagation();
        navigate(`/dogs/${dog.$id}`);}}>
      <div className="w-[160px] flex flex-row bg-light-1 border border-light-3 rounded-lg flex-start gap-4 px-2 py-2 cursor-pointer">
        <img
          src={dog.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-10 h-10"
        />
        <div className="flex flex-col">
          <p className="flex flex-row base-medium text-dark-1 line-clamp-1 hover:underline">
            {dog.name}
          </p>
          <div className="flex flex-row">
              <p className="line-clamp-1 text-xs text-dark-4 italic">{dog.breed}</p>
              <p className="line-clamp-1 text-xs text-dark-4 italic">{dog.sex=='Female' ? ('♀') : ('♂')}</p>
          </div>
        </div>
      </div>
    </HoverCardTrigger>
    <HoverCardContent 
      className="bg-light-1 z-100 border border-light-2" 
      onClick={(e) => 
      {e.stopPropagation();
        navigate(`/dogs/${dog.$id}`);}}>
      <div className="flex-start flex-row gap-4 w-full cursor-pointer">
        <img
          src={dog.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-10 h-10"
        />
        <div className="flex flex-col">
          <p className="flex flex-row base-medium text-dark-1 line-clamp-1 hover:underline cursor-pointer">
            {dog.name}
          </p>
          <div className="flex flex-row">
              <p className="line-clamp-1 text-xs text-dark-4 italic">{dog.breed}</p>
              <p className="line-clamp-1 text-xs text-dark-4 italic">{dog.sex=='Female' ? ('♀') : ('♂')}</p>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
  
  );
};

export default DogTag;