// app/StoreProvider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./store";

type Props = {
  children: React.ReactNode;
};

export default function StoreProvider({ children }: Props) {
  return <Provider store={store}>{children}</Provider>;
}
