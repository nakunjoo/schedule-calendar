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
    > .day {
      display: inline-block;
      text-align: center;
      width: 30px;
      height: 30px;
      background-color: #aa5fd3;
      color: #efefef;
      border-radius: 50%;
      line-height: 30px;
      font-weight: bold;
    }
    > .today {
      font-weight: bold;
      color: #aa5fd3;
    }
  }
`;
