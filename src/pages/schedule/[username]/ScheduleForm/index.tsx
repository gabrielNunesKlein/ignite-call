
import React, { useState } from 'react'
import CalendarStep from './CalendarStep'
import ConfirmStep from './ConfirmStep'

export default function ScheduleForm() {
    const [selectDateTime, setSelectDateTime] = useState<Date | null>()

    function handleClearSelectedDateTime(){
        setSelectDateTime(null)
    }

    if(selectDateTime){
        return <ConfirmStep onCancelConfimation={handleClearSelectedDateTime} schedulingDate={selectDateTime} />
    }

    return (
        <div>
            <CalendarStep 
                onSelectedDateTime={setSelectDateTime}
            />
        </div>
    )
}
