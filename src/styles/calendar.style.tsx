import { css, styled } from "styled-components";

export const CalendarBodyRow = styled.div`
  &:last-child {
    border-bottom: none;
  }
`;

export const CalendarRowDiv = styled.div`
  &.disabled {
    background-color: #bababa;
    pointer-events: none;
  }

  &.selected {
    background-color: #ceecf5;
  }
`;
