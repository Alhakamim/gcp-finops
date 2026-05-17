"use client";

import { createContext, useContext } from "react";

export type Lang = "en" | "ar";
export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} });
export const useLang = () => useContext(LangContext);
