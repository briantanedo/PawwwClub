// These are ReactQuery queries and mutations
// They issue requests to the backend using the api functions
// These are consumed by the application frontend

import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { INewDog, INewHousehold, INewPost, INewUser, IUpdateDog, IUpdateHousehold, IUpdatePost } from '@/types'
import { createDog, createHousehold, createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getInfiniteUsers, getPostById, getRecentPosts, getUserById, getUserDogs, getUserPosts, likePost, savePost, searchDogs, searchPosts, signInAccount, signOutAccount, updateDog, updateHousehold, updatePost } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
             email: string; 
             password: string 
        }) => signInAccount(user)
    })
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    });
}
  
export const useGetRecentPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts as any,
        initialPageParam: undefined,
        getNextPageParam: (lastPage: any) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[]}) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string}) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }

    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }

    })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts as any,
        initialPageParam: undefined,
        getNextPageParam: (lastPage: any) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useGetUsers = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
        queryFn: getInfiniteUsers as any,
        initialPageParam: undefined,
        getNextPageParam: (lastPage: any) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchPosts = ( searchTerm: string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}

export const useCreateDog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ( dog: INewDog ) => createDog(dog),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_DOGS]
            })
        }
    });
}

export const useUpdateDog = () => {
    // const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dog: IUpdateDog) => updateDog(dog),
        /* onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DOG_BY_ID, data?.$id]
            })
        } */

    })
}

export const useGetUserPosts = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
      queryFn: () => getUserPosts(userId),
      enabled: !!userId,
    });
  };

export const useGetUserDogs = (userId?: string) => {
return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DOGS, userId],
    queryFn: () => getUserDogs(userId),
    enabled: !!userId,
});
};

export const useSearchDogs = ( searchTerm: string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_DOGS, searchTerm],
        queryFn: () => searchDogs(searchTerm),
        enabled: !!searchTerm
    })
}

export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };

export const useCreateHousehold = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (household: INewHousehold) => createHousehold(household),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_HOUSEHOLDS]
            })
        } 
    })
}

export const useUpdateHousehold = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (household: IUpdateHousehold) => updateHousehold(household),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_HOUSEHOLDS]
            })
        }
    })
}