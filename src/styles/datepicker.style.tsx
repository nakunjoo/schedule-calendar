import { css, styled } from "styled-components";
import { store } from "@/stores";

const userOptions = store.getState().optionReducer.value;

export const PickerBox = styled.div`
  .active {
    border: 2px solid ${userOptions.themeColor};
    background-color: #eedeff;

    &:focus {
      border: 2px solid ${userOptions.themeColor};
      outline: none;
    }
  }
  .disabled {
    background-color: #bababa;
    pointer-events: none;
  }
`;
