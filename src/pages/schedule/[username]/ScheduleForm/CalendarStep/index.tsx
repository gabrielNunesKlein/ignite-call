import Calendar from "@/src/components/Calendar";
import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from "./styles";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { api } from "@/src/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface Availability {
    possibleTimes: number[]
    availableTimes: number[]
}

interface CalendarStepProps {
    onSelectedDateTime: (date: Date) => void;
}

export default function CalendarStep({ onSelectedDateTime }: CalendarStepProps){

    const [selecteDate, setSelectedDate] = useState<Date | null>(null)
    //const [availability, setAvailability] = useState<Availability | null>(null)

    const router = useRouter()

    const isDateSelected = !!selecteDate
    const username = router.query.username?.toString()

    const weekDay = selecteDate ? dayjs(selecteDate).format('ddd') : null
    const describedDate = selecteDate ? dayjs(selecteDate).format('DD[ de ]MMM') : null

    const selectedDateWithoutTime = selecteDate ? dayjs(selecteDate).format('YYYY-MM-DD') : null

    const { data: availability } = useQuery<Availability>({
        queryKey: ['availability', selectedDateWithoutTime],
        queryFn: async () => {
            const response = await api.get(`/users/${username}/availability`, {
                params: {
                    date: selectedDateWithoutTime,
                },
            })

            return response.data
        },
        enabled: !!selecteDate,
    })

    function handleSelectTime(hour: number){
        const dateWithTime = dayjs(selecteDate).set('hour', hour).startOf('hour').toDate()
        onSelectedDateTime(dateWithTime)
    }

    // useEffect(() => {
    //     if(!selecteDate){
    //         return
    //     }

    //      api.get(`/users/${username}/availability`, {
    //         params: {
    //             date: dayjs(selecteDate).format('YYYY-MM-DD')
    //         }
    //     }).then((response) => {
    //         setAvailability(response.data)
    //     })

    // }, [selecteDate, username])

    return (
        <Container isTimePickerOpen={isDateSelected}>
            <Calendar 
                selectedDate={selecteDate}
                onDateSelected={setSelectedDate}
            />
            {isDateSelected && (
                <TimePicker>
                    <TimePickerHeader>
                        {weekDay} <span>{describedDate}</span>
                    </TimePickerHeader>

                    <TimePickerList>
                        {availability?.possibleTimes?.map((hour) => {
                            return (
                                <TimePickerItem onClick={() => handleSelectTime(hour)} key={hour} disabled={!availability.availableTimes?.includes(hour)}>
                                    {String(hour).padStart(2, '0')}:00
                                </TimePickerItem>
                            )
                        })}
                    </TimePickerList>
                </TimePicker>
            )}
        </Container>
    )
}