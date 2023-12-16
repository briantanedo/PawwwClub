import { Models } from "appwrite";
import OrangeLoader from "./OrangeLoader";
import GridPostList from "./GridPostList";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document>;
}

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if(isSearchFetching) return <OrangeLoader />
  
  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents}/>
    )
  }
  
  return (
    <p className="text-dark-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults