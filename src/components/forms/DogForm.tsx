import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FileUploader from "../shared/FileUploader"
import { DogValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreateDog, useUpdateDog } from "@/lib/react-query/queriesAndMutations"

type DogFormProps = {
    dog?: Models.Document;
    action: 'Create' | 'Update';
}

const DogForm = ({ dog, action }: DogFormProps) => {
   const { mutateAsync: createDog, isPending: isLoadingCreate } = useCreateDog();
   const { mutateAsync: updateDog, isPending: isLoadingUpdate } = useUpdateDog();

   const { user } = useUserContext();
   const { toast } = useToast();
   const navigate = useNavigate();

    // 1. Define your form.
  const form = useForm<z.infer<typeof DogValidation>>({
    resolver: zodResolver(DogValidation),
    defaultValues: {
      name: dog ? dog?.name : '',
      household: dog ? dog.householdId : "",
      breed: dog ? dog?.breed : "",
      file: [],
      sex: dog ? dog?.sex : "",
      bio: dog ? dog?.bio : "",
      pcciId: dog ? dog?.pcciId : "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof DogValidation>) {
    if(dog && action === 'Update') {
      const updatedDog = await updateDog({
        ...values,
        dogId: dog.$id,
        imageId: dog?.imageId,
        imageUrl: dog?.imageUrl,
      })

      if(!updatedDog) {
        toast({ title: 'Please try again'})
      }

      return navigate(`/dogs/${dog.$id}`);
    }

    const newDog = await createDog({
        ...values,
        userId: user.id,
    })
    
    if(!newDog) {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type = "text" className="shad-input" {...field} />
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
                    mediaUrl={dog?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Breed</FormLabel>
              <FormControl>
                <Input type = "text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Sex</FormLabel>
              <FormControl>
                <Input type = "text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">About</FormLabel>
            <FormControl>
              <Input type = "text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}
        />
        <FormField
          control={form.control}
          name="pcciId"
          render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">PCCI ID</FormLabel>
            <FormControl>
              <Input type = "text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message"/>
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
                {action} Dog
            </Button>
        </div>
      </form>
    </Form>
  )
}

export default DogForm