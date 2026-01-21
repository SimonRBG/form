import React from "react";
import { FieldType } from "../types";
import { CiBoxList, CiCircleQuestion, CiText } from "react-icons/ci";
import { RiNumber8 } from "react-icons/ri";

export const getFieldTypeIcon = (type: FieldType): React.ReactNode => {
  switch (type) {
    case FieldType.TEXT:
      return <CiText />;
    case FieldType.NUMBER:
      return <RiNumber8 />;
    case FieldType.DROPDOWN:
      return <CiBoxList />;
    default:
      return <CiCircleQuestion />;
  }
};
