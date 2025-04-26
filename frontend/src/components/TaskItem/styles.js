import styled from "styled-components";

export const Item = styled.div`
  background: ${({ theme }) => theme.itemBg};
  padding: 10px 14px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 22px;
  height: 22px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg};
  appearance: none;
  outline: none;
  margin-right: 10px;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  cursor: pointer;
  position: relative;

  &:checked {
    background: #43a047;
    border: 1.5px solid #43a047;
  }

  &:hover {
    border: 1.5px solid #43a047;
    box-shadow: 0 0 4px #43a04733;
  }

  &:focus {
    border: 1.5px solid #43a047;
    box-shadow: 0 0 4px #43a04733;
  }

  &:checked::after {
    content: "";
    position: absolute;
    left: 7px;
    top: 3px;
    width: 6px;
    height: 12px;
    border: solid #fff;
    border-width: 0 3px 3px 0;
    border-radius: 1px;
    transform: rotate(45deg);
    pointer-events: none;
    box-sizing: border-box;
    display: block;
  }
`;

export const Text = styled.span`
  text-decoration: ${(props) => (props.$completed ? "line-through" : "none")};
  color: ${(props) =>
    props.$completed
      ? props.theme.itemCompleted
      : props.theme.itemText};
  font-size: 16px;
  flex-grow: 1;
  margin-left: 10px;
  max-width: min(438px, 50vw);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PriorityLabel = styled.div`
  color: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ color, theme }) => color || theme.priorityDefault};
`;

export const EditInput = styled.input`
  border: none;
  background: transparent;
  font-size: 16px;
  color: ${({ theme }) => theme.itemText};
  flex-grow: 1;
  margin-left: 10px;
  outline: none;
`;

export const EditSelect = styled.select`
  background: #f2bc00;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  padding: 4px 12px;
  margin-left: 10px;
  outline: none;
  min-width: 100px;
  cursor: pointer;

  &:focus {
    border: 1.5px solid #1976d2;
    background: #ffe082;
    color: #333;
  }
`;
