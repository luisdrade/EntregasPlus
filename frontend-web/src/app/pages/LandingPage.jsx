import { Header } from "../components/_Header";
import { Hero } from "../components/_Hero";
import { Link } from "react-router-dom";
import React from "react";
import { Features } from "../components/_Features";
import { Footer } from "../components/_Footer";

export function LandingPage() {
  return (
    <div className="landing-page">
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
