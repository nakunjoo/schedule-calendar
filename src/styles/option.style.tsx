import { store } from "@/stores";
import { css, styled } from "styled-components";

const userOptions = store.getState().optionReducer.value;

export const OptionSwitch = styled.div`
  input {
    display: none;
  }

  label {
    display: block;
    position: relative;
    width: 60px;
    height: 30px;
    background: #d3d3d3;
    border-radius: 60px;
    transition: background 0.4s;
    cursor: pointer;
  }

  label::after {
    content: "";
    position: absolute;
    left: 2.5px;
    top: 50%;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    background-color: #fff;
    transform: translateY(-50%);
    box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.4s;
  }

  label::before {
    font-size: 24px;
    position: absolute;
    left: 45px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.4s;
  }

  .switch:checked + label {
    background: rgba(109, 104, 107);
  }

  .switch:checked + label::after {
    left: calc(100% - 23px);
  }

  .switch:checked + label::before {
    color: #fff;
    left: 15px;
  }
`;
