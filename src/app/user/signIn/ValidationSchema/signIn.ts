import { z } from "zod";

export const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 
      "Invalid password"
    )
});

// Type for form data
export type SignInData = z.infer<typeof signInSchema>;

// Validation function that can be reused
export const validateSignIn = (data: SignInData) => {
  return signInSchema.safeParse(data);
};