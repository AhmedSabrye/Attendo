import { Outlet } from "react-router";
import GroupHeader from "./GroupHeader";
import AttendanceSheetModal from "./modals/AttendanceSheetModal/AttendanceSheetModal";
import { useState } from "react";
import TemplateManager from "./modals/TemplateManager/TemplateManager";

export default function GroupLayout() {
  const [modal, setModal] = useState<0 |1 | 2 >(0)
  return (
    
    <div className="p-4 h-full">
      <button onClick={() => {setModal(1)}}>Template Manager</button>
      <GroupHeader onAttendanceSheetModalOpen={() => {setModal(1)}} />
      <Outlet />
      {modal === 2 && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <AttendanceSheetModal onCsvProcessed={() => {}} onClose={() => {setModal(0)}} />
      </div>
      )}
      {modal === 1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <TemplateManager onClose={() => {setModal(0)}} proceed={() => {setModal(2)}} />
        </div>
      )}
    </div>
  );
}
