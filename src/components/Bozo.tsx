"use client";

import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppStateProvider } from "@/contexts/AppState";
import Game from "./Game";

const queryClient = new QueryClient();

const Bozo = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <AnimatePresence mode="wait">
          <Game />
        </AnimatePresence>
      </AppStateProvider>
    </QueryClientProvider>
  );
};

export default Bozo;
