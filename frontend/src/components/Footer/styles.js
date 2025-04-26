import styled from "styled-components";

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 16px 0;
  background: ${({ theme }) => theme.footer};
  color: ${({ theme }) => theme.footerText};
  text-align: center;
  font-size: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  letter-spacing: 0.5px;
`;
