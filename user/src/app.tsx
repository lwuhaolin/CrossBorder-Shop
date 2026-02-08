import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

export const rootContainer = (container: any) => {
  return React.createElement(I18nextProvider, { i18n }, container);
};
