// These are API functions for appwrite
// They connect the website to appwrite and allows us to get/post to the appwrite database
// These functions are consumed by ReactQuery in /react-query/queriesAndMutations.ts

import { ID, Query } from 'appwrite';

import { INewDog, INewHousehold, INewPost, INewUser, IUpdateDog, IUpdateHousehold, IUpdatePost } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        );

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        return newUser;
    }   catch (error) {
        console.log(error);
        return error;
    }
}
// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
    accountId: string;
    email: string;
    name: string;
    imageUrl: URL;
    username?: string;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    }   catch (error) {
        console.log(error);
    }
}
// ============================== SIGN IN
export async function signInAccount(user: { email: string ; password: string }) {
    try {
        const session = await account.createEmailSession(user.email,user.password);

        return session;
    }   catch (error) {
        console.log(error);
    }
}
// ============================== GET USER
export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentAccount) throw Error;

        return currentUser.documents[0];
    }   catch (error) {
        console.log(error);
    }
}
// ============================== SIGN OUT
export async function signOutAccount() {
    try {
        const session = await account.deleteSession("current");

        return session;
    }   catch (error) {
        console.log(error);
    }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
    try {
        // Upload image to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if(!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if(!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        );

        if(!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newPost;
    } catch (error) {
      console.log(error);
    }
}
// ============================== UPDATE POST
export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        }

        if(hasFileToUpdate) {
            // Upload image to storage
            const uploadedFile = await uploadFile(post.file[0]);
            if(!uploadedFile) throw Error;
            
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            
            if(!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }

        // Convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        // Save post to database
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags
            }
        );

        if(!updatedPost) {
            await deleteFile(post.imageId);
            throw Error;
        }

        return updatedPost;
    } catch (error) {
      console.log(error);
    }
}
// ============================== SUB FUNCTIONS
    export async function uploadFile(file: File) {
        try {
            const uploadedFile = await storage.createFile(
                appwriteConfig.storageId,
                ID.unique(),
                file
            );

            return uploadedFile;
        } catch (error) {
            console.log(error);
        }
    }
    export function getFilePreview(fileId: string) {
        try {
            const fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                1440,
                1440,
                "top",
                100,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                "webp",

            );

            if (!fileUrl) throw Error;

            return fileUrl;
        }   catch (error) {
            console.log(error);
        }
    }
    export async function deleteFile(fileId: string) {
        try {
            await storage.deleteFile(appwriteConfig.storageId, fileId);

            return { status: 'ok' }
        }   catch (error) {
            console.log(error);
        }
    }

// ============================== POST ACTIONS
export async function likePost(postId: string, likesArray: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes:likesArray
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}
export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )

        if(!updatedPost) throw Error;

        return updatedPost;
    } catch (error) {
        console.log(error);
    }
}
export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId,
        )

        if(!statusCode) throw Error;

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}
export async function deletePost(postId:string, imageId:string) {
    if(!postId || !imageId) throw Error;

    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return { status: 'ok' }
    } catch (error) {
        console.log(error);
    }
}

// ============================== POST UTILITIES
export async function getPostById(postId: string) {
    try {
        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        return post;
    } catch (error) {
        console.log(error);
    }
}

// ============================================================
// FEEDS
// ============================================================

// ============================== GET RECENT POSTS (HOME FEED)
export async function getRecentPosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(20)]

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;
        
        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserPosts(userId?: string) {
    if (!userId) return;
  
    try {
      const post = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!post) throw Error;
  
      return post;
    } catch (error) {
      console.log(error);
    }
  }

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function getInfiniteUsers({ pageParam }: { pageParam: number }) {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        )

        if(!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error;

        return posts;
    } catch (error) {
        console.log(error);
    }
}

export async function searchDogs(searchTerm: string) {
    try {
        const dogs = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('name', searchTerm)]
        )

        if(!dogs) throw Error;

        return dogs;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserDogs(userId?: string) {
    if (!userId) return;
  
    try {
      const dogs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.dogsCollectionId,
        [Query.equal("owner", userId), Query.orderDesc("$createdAt")]
      );
  
      if (!dogs) throw Error;
  
      return dogs;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getHouseholdDogs(householdId?: string) {
    if (!householdId) return;
  
    try {
      const dogs = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.dogsCollectionId,
        [Query.equal("householdId", householdId), Query.orderDesc("$createdAt")]
      );
  
      if (!dogs) throw Error;
  
      return dogs;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getUserHouseholds(userId?: string) {
    if (!userId) return;
  
    try {
      const households = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.householdsCollectionId,
        [Query.equal("users", [userId]), Query.orderDesc("$createdAt")]
      );
  
      if (!households) throw Error;
  
      return households;
    } catch (error) {
      console.log(error);
    }
  }

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
    try {
      const user = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        userId
      );
  
      if (!user) throw Error;
  
      return user;
    } catch (error) {
      console.log(error);
    }
  }


// ============================================================
// DOGS
// ============================================================

export async function createDog(dog: INewDog) {
    try {
        // Upload image to storage
        const uploadedFile = await uploadFile(dog.file[0]);

        if(!uploadedFile) throw Error;

        // Get file url
        const fileUrl = getFilePreview(uploadedFile.$id);

        if(!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags in an array
        // const tags = dog.tags?.replace(/ /g,'').split(',') || [];

        // Save dog to database
        const newDog = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.dogsCollectionId,
            ID.unique(),
            {
                keyOwner: dog.userId,
                owners: [dog.userId],
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                name: dog.name,
                breed: dog.breed,
                sex: dog.sex,
                bio: dog.bio,
                pcciId: dog.pcciId,
                household: dog.householdId
            }
        );

        console.log(newDog);

        if(!newDog) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        return newDog;
    } catch (error) {
      console.log(error);
    }
}

export async function updateDog(dog: IUpdateDog) {
    const hasFileToUpdate = dog.file.length > 0;
    try {
        let image = {
            imageUrl: dog.imageUrl,
            imageId: dog.imageId,
        }

        if(hasFileToUpdate) {
            // Upload image to storage
            const uploadedFile = await uploadFile(dog.file[0]);
            if(!uploadedFile) throw Error;
            
            // Get file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            
            if(!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }

        // Convert tags in an array
        // const tags = post.tags?.replace(/ /g,'').split(',') || [];

        // Save post to database
        const updatedDog = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.dogsCollectionId,
            dog.dogId,
            {
                householdId: dog.householdId,
                name: dog.name,
                breed: dog.breed,
                sex: dog.sex,
                imageId: image.imageId,
                imageUrl: image.imageUrl,
                bio: dog.bio,
                pcciId: dog.pcciId,
            }
        );

        if(!updatedDog) {
            await deleteFile(dog.imageId);
            throw Error;
        }

        return updatedDog;
    } catch (error) {
      console.log(error);
    }
}

export async function createHousehold(household: INewHousehold) {
    try {
        const newHousehold = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.householdsCollectionId,
            ID.unique(),
            {
                creator: household.userId,
                name: household.name,
                users: [household.userId]
            }
        );

        console.log(newHousehold);

        if(!newHousehold) {
            throw Error;
        }

        return newHousehold;
    } catch (error) {
      console.log(error);
    }
}

export async function updateHousehold(household: IUpdateHousehold) {
    try {
        
        // Save post to database
        const updatedHousehold = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.householdsCollectionId,
            household.householdId,
            {
                name: household.name,
            }
        );

        if(!updatedHousehold) {
            throw Error;
        }

        return updatedHousehold;
    } catch (error) {
      console.log(error);
    }
}