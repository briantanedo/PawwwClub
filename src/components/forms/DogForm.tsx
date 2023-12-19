import { Models } from "appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DogValidation } from "@/lib/validation";
import {
  useCreateDog,
  useGetUserHouseholds,
  useUpdateDog,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import OrangeLoader from "../shared/OrangeLoader";

type DogFormProps = {
  dog?: Models.Document;
  action: "Create" | "Update";
};

// 1. Define your form.
const DogForm = ({ dog, action }: DogFormProps) => {
  const { mutateAsync: createDog, isPending: isLoadingCreate } = useCreateDog();
  const { mutateAsync: updateDog, isPending: isLoadingUpdate } = useUpdateDog();

  const { user } = useUserContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: userHouseholdsData, isPending: isUserHouseholdsLoading } =
    useGetUserHouseholds(user.id);

  const userHouseholds = userHouseholdsData?.documents;

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
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof DogValidation>) {
    if (dog && action === "Update") {
      const updatedDog = await updateDog({
        ...values,
        dogId: dog.$id,
        imageId: dog?.imageId,
        imageUrl: dog?.imageUrl,
      });

      if (!updatedDog) {
        toast({ title: "Please try again" });
      }

      return navigate(`/posts/${dog.$id}`);
    }

    const newDog = await createDog({
      ...values,
      userId: user.id,
    });

    if (!newDog) {
      toast({
        title: "Please try again",
      });
    }

    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
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
              <FormMessage className="shad-form_message" />
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
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
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
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
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
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
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
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="householdId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label pr-2">Household</FormLabel>
              {isUserHouseholdsLoading ? (
                <OrangeLoader />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between bg-light-2",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? userHouseholds?.find(
                              (userHousehold) =>
                                userHousehold.$id === field.value
                            )?.name
                          : "Select household"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-full p-0 justify-between bg-light-1">
                    <Command>
                      <CommandInput placeholder="Search household..." />
                      <CommandEmpty>No household found.</CommandEmpty>
                      <CommandGroup>
                        {userHouseholds?.map((userHousehold) => (
                          <CommandItem
                            value={userHousehold.name}
                            key={userHousehold.$id}
                            onSelect={() => {
                              form.setValue("householdId", userHousehold.$id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                userHousehold.$id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {userHousehold.name}
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
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || (isLoadingUpdate && "Loading...")}
            {action} Dog
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DogForm;
