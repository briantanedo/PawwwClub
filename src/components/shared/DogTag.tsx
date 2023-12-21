import { Models } from "appwrite";

type DogTagProps = {
  dog: Models.Document;
};

const DogTag = ({ dog }: DogTagProps) => {
  return (
    <div className="flex-start flex-row gap-4 w-full px-2 py-2">
      <img
        src={dog.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-10 h-10"
      />
      <div className="flex flex-col">
        <p className="flex flex-row base-medium text-dark-1 line-clamp-1">
          {dog.name}
        </p>
        <div className="flex flex-row">
            <p className="line-clamp-1 text-xs text-light-4 italic">{dog.breed}</p>
            <p className="line-clamp-1 text-xs text-light-4 italic">{dog.sex=='Female' ? ('♀') : ('♂')}</p>
        </div>
      </div>
    </div>
  );
};

export default DogTag;