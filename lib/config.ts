export const PRICING = {
  donationPerAdult: 20,
  extraShirtPrice: 10,
  additionalDonationMax: 500,
};

export const EVENT = {
  name: process.env.NEXT_PUBLIC_EVENT_NAME ?? "SGVP Gurukul USA Walk-A-Thon 2026",
  date: process.env.NEXT_PUBLIC_EVENT_DATE ?? "April 05, 2026",
  location:
    process.env.NEXT_PUBLIC_EVENT_LOCATION ??
    "2006 Fort Argyle Rd, Bloomingdale, GA 31302",
};

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
