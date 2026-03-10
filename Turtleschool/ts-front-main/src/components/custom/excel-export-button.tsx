import React from "react";
import * as XLSX from "xlsx";
import { Button } from "./button";
import { saveAs } from "file-saver";

interface ExcelExportButtonProps {
  data: any[];
  filename: string;
  sheetName?: string;
  buttonText?: string;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  data,
  filename,
  sheetName = "Sheet1",
  buttonText = "엑셀 저장",
}) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `${filename}.xlsx`);
  };

  return (
    <Button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-600/90"
      type="button"
    >
      {buttonText}
    </Button>
  );
};

export default ExcelExportButton;
