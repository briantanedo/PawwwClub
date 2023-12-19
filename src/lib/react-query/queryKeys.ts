export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",
  
    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",
  
    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_INFINITE_USERS = "getInfiniteUsers",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFilePreview",
  
    //  SEARCH KEYS
    SEARCH_POSTS = "searchPosts",
    SEARCH_DOGS = "searchDogs",

    // DOG KEYS
    GET_DOGS = "getDogs",
    GET_USER_DOGS = "getUserDogs",
    GET_HOUSEHOLD_DOGS = "getUserDogs",
    GET_DOG_BY_ID = "getDogById",

    // HOUSEHOLD KEYS
    GET_HOUSEHOLDS = "getHouseholds",
    GET_USER_HOUSEHOLDS = "getUserHouseholds",
    GET_HOUSEHOLD_BY_ID = "getDogById",
  }