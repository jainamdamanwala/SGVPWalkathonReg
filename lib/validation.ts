import { z } from "zod";
import { PRICING } from "@/lib/config";

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  adults: z.number().int().min(1).max(25),
  extraShirts: z.number().int().min(0).max(100),
  donationAmount: z.number().int().min(PRICING.donationPerAdult),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export function calculateTotals(input: RegistrationInput) {
  const minimumDonation = input.adults * PRICING.donationPerAdult;
  if (input.donationAmount < minimumDonation) {
    throw new Error(`Donation must be at least $${minimumDonation}.`);
  }

  const shirtAmount = input.extraShirts * PRICING.extraShirtPrice;
  const totalAmount = input.donationAmount + shirtAmount;

  return {
    minimumDonation,
    shirtAmount,
    totalAmount,
  };
}
