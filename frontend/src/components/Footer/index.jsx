import React from "react";
import { FooterContainer } from "./styles";

export default function Footer() {
  return (
    <FooterContainer>
      Desenvolvido com{" "}
      <span role="img" aria-label="café">
        ☕️
      </span>{" "}
      e dedicação por Dionatan &middot; UNO Challenge {new Date().getFullYear()}
    </FooterContainer>
  );
}
