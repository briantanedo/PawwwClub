import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreatePost, useGetUserDogs, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import OrangeLoader from "../shared/OrangeLoader"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command"
import { useState } from "react"
import DogTag from "../shared/DogTag"

type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update';
}

const PostForm = ({ post, action }: PostFormProps) => {
   const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
   const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatePost();


   const { user } = useUserContext();
   const { toast } = useToast();
   const navigate = useNavigate();

   const { data: userDogsData, isPending: isUserDogsLoading } = useGetUserDogs(user.id);

  const userDogs = userDogsData;

  //convert post.dogs DocumentList to string

  const [postDogs, setPostDogs] = useState<string>(`${post?.dogs ? (post?.dogs.map((dog: Models.Document)=>(dog.$id))).join(',') : ''}`);
  console.log(postDogs)

    // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(',') : '',
      dogIds: post ? postDogs : ''
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if(post && action === 'Update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if(!updatedPost) {
        toast({ title: 'Please try again'})
      }

      return navigate(`/posts/${post.$id}`);
    }

    const newPost = await createPost({
        ...values,
        userId: user.id,
    })
    
    if(!newPost) {
        toast({
            title: 'Please try again',
        })
    }

    navigate("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader 
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type = "text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input type = "text" className="shad-input" placeholder="Art, Expression, Learn" {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dogIds"
          render={({ field }) => (
            <FormItem>
              {isUserDogsLoading ? (
                <OrangeLoader />
              ) : (
                <Popover>
                  <div className="flex flex-row flex-start">
                    <FormLabel className="shad-form_label pr-2">Dogs</FormLabel>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between border border-primary-500 bg-light-1 text-primary-500"
                        >
                          {"+ Add dogs"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                  </div>
                  <ul className="flex flex-start gap-2">

                    {postDogs
                      ? postDogs.split(',').map(
                        (dogId:string) => (
                          <li key={dogId} className="w-[160px] flex flex-row bg-light-1 drop-shadow border border-light-2 rounded-md ">
                            <DogTag key={dogId} dog={userDogs?.documents.find(
                              (userDog) => (
                                userDog.$id === dogId
                              )
                            )!}/>
                            <Button 
                            variant="destructive"
                            className="text-light-4 hover:text-red z-20 px-1.5 py-2.5 h-4"
                            onClick={() => {

                              if(postDogs.includes(dogId)) {
                                setPostDogs(postDogs.replace(`,${dogId}`, "").replace(`${dogId},`, "").replace(`${dogId}`, "").replaceAll(",,",","));
                                form.setValue("dogIds", postDogs);
                              } else {
                                setPostDogs(postDogs=='' ? dogId : postDogs.concat(",",dogId).replaceAll(",,",","))
                                form.setValue("dogIds", postDogs);
                              }
                            }}>
                              x
                            </Button>
                          </li>
                        ))
                      : <></>}
                  </ul>
                  <PopoverContent className="flex w-full p-0 justify-between bg-light-1">
                    <Command>
                      <CommandInput placeholder="Search dog..." />
                      <CommandEmpty>No dogs found.</CommandEmpty>
                      <CommandGroup>
                        {userDogs?.documents.map((userDog) => (
                          <CommandItem
                            value={userDog.name}
                            key={userDog.$id}
                            className="hover:bg-light-2"
                            onSelect={() => {

                              if(postDogs.includes(userDog.$id)) {
                                setPostDogs(postDogs.replace(`,${userDog.$id}`, "").replace(`${userDog.$id},`, "").replace(`${userDog.$id}`, "").replaceAll(",,",","));
                                form.setValue("dogIds", postDogs);
                              } else {
                                setPostDogs(postDogs=='' ? userDog.$id : postDogs.concat(",",userDog.$id).replaceAll(",,",","))
                                form.setValue("dogIds", postDogs);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                postDogs.includes(userDog.$id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {userDog.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
            <Button 
                type="button" 
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}>
                Cancel
            </Button>
            <Button 
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingCreate || isLoadingUpdate}>
                {isLoadingCreate || isLoadingUpdate && 'Loading...'}
                {action} Post
            </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm