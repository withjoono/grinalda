import { create } from "zustand";

interface SocialSignUpState {
  socialType: "google" | "naver" | null;
  token: string | null;
  name: string | null;
  email: string | null;

  setData({
    socialType,
    token,
    name,
    email,
  }: {
    socialType: "google" | "naver" | null;
    token: string | null;
    name: string | null;
    email: string | null;
  }): void;

  clearData(): void;
}

export const useSocialSignUp = create<SocialSignUpState>((set) => ({
  socialType: null,
  token: null,
  name: null,
  email: null,
  setData({ socialType, token, name, email }) {
    set({
      socialType,
      token,
      name,
      email,
    });
  },
  clearData() {
    set({
      socialType: null,
      token: null,
      name: null,
      email: null,
    });
  },
}));
