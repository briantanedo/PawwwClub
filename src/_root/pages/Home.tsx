import OrangeLoader from "@/components/shared/OrangeLoader";
import PostCardList from "@/components/shared/PostCardList";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage, isFetching: isPostLoading } = useGetRecentPosts();

  useEffect(() => {
    if(inView) fetchNextPage;
  }, [inView])
  
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <OrangeLoader />
          ) : (
          <div className="flex w-full h-full">
            {posts?.pages.map((item, index) => (
              <PostCardList posts={item.documents} key={`page-${index}`}/>
            ))}
          </div>
          )}
        </div>
        {hasNextPage && (
        <div ref={ref} className="mt-10">
          <OrangeLoader />
        </div>
      )}
      </div>
    </div>
  )
}

export default Home