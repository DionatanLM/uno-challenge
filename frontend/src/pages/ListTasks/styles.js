import { Select as MuiSelect, OutlinedInput } from "@mui/material";
import styled from "styled-components";

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 8px;
`;

export const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0;
  margin-top: 0;
  text-align: left;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: ${({ theme }) => theme.card};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};

  @media (max-width: 650px) {
    padding: 12px;
    max-width: 85vw;
  }
`;

export const TaskInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const Select = styled(MuiSelect)`
  && {
    min-width: 120px;
    height: 40px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.border};
    font-size: 0.9rem;
    padding: 0 8px;
    display: flex;
    color: ${({ theme }) => theme.text};
    background: ${({ theme }) => theme.inputBg}
    align-items: center;
    .MuiSelect-select {
      padding: 10px 8px;
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.text};
    }
    fieldset {
      border: none;
    }
  }
`;

export const Input = styled(OutlinedInput)`
  &.MuiOutlinedInput-root,
  & .MuiOutlinedInput-root {
    height: 40px;
    font-size: 0.9rem;
    transition: border 0.2s ease-in-out, box-shadow 0.2s, background 0.2s;
    box-shadow: none;
    background: ${({ theme }) => theme.inputBg}
    color: ${({ theme }) => theme.inputText};

    &:hover {
      border-color: #1976d2;
    }
  }

  & .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 12px;
    transition: border 0.2;
  }

  &.Mui-focused .MuiOutlinedInput-notchedOutline,
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${({ theme }) => theme.border} !important;
    box-shadow: none !important;
    outline: none !important;
  }

  & .MuiInputBase-input {
    padding: 10px 12px;
    height: 40px;
    box-sizing: border-box;
    outline: none;
    color: ${({ theme }) => theme.inputText};
  }

  & .MuiInputBase-input:focus,
  & .MuiInputBase-input:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }

  & .MuiInputLabel-root {
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border: 1.5px solid #1976d2;
    box-shadow: 0 0 4px #1976d233;
    transition: border 0.2s, box-shadow 0.2s;
  }
`;

export const Button = styled.button`
  background: rgba(0, 0, 0, 0.07);
  color: #888;
  border: 1px solid #0000002b;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 120px;
  transition: min-height 0.2s;
`;

export const EmptyList = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.itemCompleted};
  font-size: 1.2rem;
  margin-top: 20px;
`;

export const EmptyListDescription = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.itemCompleted};
  font-size: 0.9rem;
  margin-top: 10px;
`;
