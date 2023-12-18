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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"

import { useGetUserById } from "@/lib/react-query/queriesAndMutations"
import React from "react"
import { Textarea } from "../ui/textarea"


type DogFormProps = {
    dog?: Models.Document;
    action: 'Create' | 'Update';
}

const DogForm = ({ dog, action }: DogFormProps) => {
    const { mutateAsync: createDog, isPending: isLoadingCreate } = useCreateDog();
    const { mutateAsync: updateDog, isPending: isLoadingUpdate } = useUpdateDog();

    const { toast } = useToast();
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false)
    const { user } = useUserContext();
    const { data: currentUser } = useGetUserById(user.id);
    
    if (!currentUser) throw Error;

    const userHouseholds = currentUser.households as Models.Document[];


    // 1. Define your form.
    const form = useForm<z.infer<typeof DogValidation>>({
    resolver: zodResolver(DogValidation),
    defaultValues: {
      name: dog ? dog?.name : "",
      breed: dog ? dog?.breed : "",
      file: [],
      sex: dog ? dog?.sex : "",
      bio: dog ? dog?.bio : "",
      pcciId: dog ? dog?.pcciId : "",
      householdId: dog ? dog?.householdId : "",
    }
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof DogValidation>) {
    if(dog && action === 'Update') {
      const updatedDog = await updateDog({
        ...values,
        dogId: dog.$id,
        householdId: dog?.householdId,
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
        householdId: userHouseholds[0].$id
    })
    
    console.log(newDog);

    if(!newDog) {
        toast({
            title: 'Please try again',
        })
    }

    navigate(-1);
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
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
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
        <FormField
          control={form.control}
          name="householdId"
          render={({ field }) => (
          <FormItem className = "flex flex-col">
            <FormLabel className="shad-form_label">Household</FormLabel>
            <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="default"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-light-2"
                    >
                    {field.value
                        ? userHouseholds.find((household: Models.Document) => household.$id === field.value)?.name
                        : "Select a Household..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-light-1">
                    <Command>
                    <CommandInput placeholder="Search household..." />
                    <CommandEmpty>No household found.</CommandEmpty>
                    <CommandGroup>
                        {userHouseholds.map((household: Models.Document) => (
                        <CommandItem
                            key={household.$id}
                            value={household.name}
                            onSelect={() => {
                            form.setValue("householdId", household.$id)
                            setOpen(false)
                            }}
                        >
                            <Check
                            className={cn(
                                "mr-2 h-4 w-4",
                                field.value === household.$id ? "opacity-100" : "opacity-0"
                            )}
                            />
                            {household.name}
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            </FormControl>
            <FormMessage className="shad-form_message"/>
          </FormItem>
        )}/>
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