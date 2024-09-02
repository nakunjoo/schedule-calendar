import { css, styled } from "styled-components";

export const PickerBox = styled.div`
  .active {
    border: 2px solid #aa5fd3;
    background-color: #eedeff;

    &:focus {
      border: 2px solid #aa5fd3;
      outline: none;
    }
  }
  .disabled {
    background-color: #bababa;
    pointer-events: none;
  }
`;
