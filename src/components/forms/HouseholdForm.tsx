import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { HouseholdValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCreateHousehold, useDeleteHousehold, useGetUserById, useUpdateHousehold } from "@/lib/react-query/queriesAndMutations"

type HouseholdFormProps = {
    household?: Models.Document;
    action: 'Create' | 'Update';
}

const HouseholdForm = ({ household, action }: HouseholdFormProps) => {
   const { mutateAsync: createHousehold, isPending: isLoadingCreate } = useCreateHousehold();
   const { mutateAsync: updateHousehold, isPending: isLoadingUpdate } = useUpdateHousehold();

   const { user } = useUserContext();
   const { toast } = useToast();
   const navigate = useNavigate();

    const { data: currentUser } = useGetUserById(user.id || "");


    // 1. Define your form.
  const form = useForm<z.infer<typeof HouseholdValidation>>({
    resolver: zodResolver(HouseholdValidation),
    defaultValues: {
      name: household ? household?.name : 
        `${user.name}'s Household ${currentUser?.households.length > 0 && currentUser?.households.length + 1}`
    }
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof HouseholdValidation>) {
    if(household && action === 'Update') {
      const updatedHousehold = await updateHousehold({
        ...values,
        householdId: household.$id,
      })

      if(!updatedHousehold) {
        toast({ title: 'Please try again'})
      }

      return navigate(-1);
    }
    
    console.log('submit');
    console.log(`user id: ${user.id}`);
    const newHousehold = await createHousehold({
        ...values,
        userId: user.id,
    })
    
    console.log(newHousehold);

    if(!newHousehold) {
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
              <FormLabel className="shad-form_label">Household Name</FormLabel>
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
                disabled={ isLoadingCreate || isLoadingUpdate}>
                { isLoadingCreate || isLoadingUpdate && 'Loading...'}
                {action} Household
            </Button>
            
        </div>
      </form>
    </Form>
  )
}

export default HouseholdForm