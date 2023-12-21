export type IContextType = {
    user: IUser;
    isLoading: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
};
  
export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
};

export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
    dogIds?: string;
};

export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    location?: string;
    tags?: string;
    dogIds?: string;
};

export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
};

export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
};

export type INewDog = {
    userId: string;
    householdId: string;
    name: string;
    breed: string;
    sex: string;
    file: File[];
    bio: string;
    pcciId: string;
};

export type IUpdateDog = {
    dogId: string;
    householdId: string;
    name: string;
    breed: string;
    sex: string;
    imageId: string;
    imageUrl: URL;
    file: File[];
    bio: string;
    pcciId: string;
};

export type IHousehold = {
    householdId: string;
    userId: string;
    name: string;
};

export type INewHousehold = {
    userId: string;
    name: string;
};

export type IUpdateHousehold = {
    householdId: string;
    name: string;
};