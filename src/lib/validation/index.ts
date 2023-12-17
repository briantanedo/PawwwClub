import * as z from "zod"

export const SignupValidation = z.object({
  name: z.string().min(2, {message: 'Name must be at least 2 characters.'}),
  username: z.string().min(2, {message: 'Username must be at least 2 characters.'}),
  email: z.string().email(),
  password: z.string().min(8, {message: 'Password must be at least 8 characters.'}),
})

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message: 'Password must be at least 8 characters.'}),
})

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(0, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(0, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

// ============================================================
// DOG PROFILE
// ============================================================
export const DogValidation = z.object({
  name: z.string().min(2, { message: "Minimum 2 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  breed: z.string().min(2, { message: "Minimum 2 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  household: z.string().min(0, { message: "Must be assigned to a household." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  sex: z.string().min(2, { message: "Minimum 2 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  bio: z.string().min(2, { message: "Minimum 2 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  pcciId: z.string().min(2, { message: "Minimum 2 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
});