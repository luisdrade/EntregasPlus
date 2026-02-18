import { Header } from "../components/_Header";
import { Hero } from "../components/_Hero";
import { Features } from "../components/_Features";
import { Footer } from "../components/_Footer";

import { Link } from "react-router-dom";
import React from "react";

export function LandingPage() {
  return (
    <div
      id="top"
      className="min-h-screen bg-background text-foreground flex flex-col font-sans"
    >
      {" "}
      {/* 1. CABEÇALHO (Header) */}
      <Header />
      <main>
        {/* 2. SEÇÃO HERO */}
        <Hero />

        {/* 3. SEÇÃO DE RECURSOS */}
        <Features />
      </main>
      {/* 4. RODAPÉ */}
      <Footer />
    </div>
  );
}
