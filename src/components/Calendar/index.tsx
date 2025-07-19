
import React, { useMemo, useState } from 'react'
import { CalendarActions, CalendarBody, CalendarContainer, CalendarDay, CalendarHeader, CalendarTitle } from './styles'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { getWeekDays } from '@/src/utils/get-week-days'
import dayjs from 'dayjs'
import { api } from '@/src/lib/axios'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'

interface CalendarWeek {
    week: number;
    days: Array<{
        date: dayjs.Dayjs,
        disabled: boolean
    }>
}

interface BlockedDates {
    blockedWeekDays: number[]
    blockedDates: number[]
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
    selectedDate: Date | null
    onDateSelected: (date: Date) => void;
}

export default function Calendar({ selectedDate, onDateSelected }: CalendarProps) {

    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set('date', 1)
    })

    const router = useRouter()

    const username = router.query.username?.toString()

    const { data: blockedDates } = useQuery<BlockedDates>({
        queryKey: ['blockedDates', currentDate.get('year'),  currentDate.get('month')],
        queryFn: async () => {
            const response = await api.get(`/users/${username}/blocked-dates`, {
                params: {
                    year: currentDate.get('year'),
                    month: currentDate.get('month') + 1
                },
            })

            return response.data
        },
    })

    function handlePreviousMonth(){
        const previousMonth = currentDate.subtract(1, 'month')
        setCurrentDate(previousMonth)
    }

    function handleNextMonth(){
        const previousMonth = currentDate.add(1, 'month')
        setCurrentDate(previousMonth)
    }

    const shortWeekDays = getWeekDays({ short: true })

    const currentMonth = currentDate.format('MMM')
    const currentYear = currentDate.format('YYYY')

    const calendarWeeks = useMemo(() => {

        if(!blockedDates){
            return []
        }
        
        const daysInMonthArray = Array.from({
            length: currentDate.daysInMonth()
        }).map((_, i) => {
            return currentDate.set('date', i + 1)
        })

        const firstWeekDay = currentDate.get('day')

        const previousMonthFillArray = Array.from({
            length: firstWeekDay,
        }).map((_, i) => {
            return currentDate.subtract(i + 1, 'day')
        }).reverse()

        const lastDayCurrentMonth = currentDate.set('date', currentDate.daysInMonth())
        const lastWeekDay = currentDate.set('date', currentDate.daysInMonth()).get('day')

        const nextMonthFilllArray = Array.from({
            length: 7 - (lastWeekDay + 1)
        }).map((_, i) => {
            return lastDayCurrentMonth.add(i + 1, 'day')
        })

        const calendarDays = [
            ...previousMonthFillArray.map(date => {
                return { date, disabled: true }
            }),
            ...daysInMonthArray.map(date => {
                return { date, 
                    disabled: date.endOf('day').isBefore(new Date()) || 
                        blockedDates?.blockedWeekDays?.includes(date.get('day')) ||
                        blockedDates.blockedDates.includes(date.get('date'))
                }
            }),
            ...nextMonthFilllArray.map(date => {
                return { date, disabled: true }
            })
        ]

        const calendarWeeks = calendarDays.reduce<CalendarWeeks>((weeks, _, i, original) => {
            const isNewWeek = i % 7 === 0

            if(isNewWeek){
                weeks.push({
                    week: i / 7 + 1,
                    days: original.length > 0 ? original.slice(i, i + 7) : [],
                })
            }

            return weeks

        }, [])

        return calendarWeeks

    }, [currentDate, blockedDates])

    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarTitle>
                    {currentMonth} <span>{currentYear}</span>
                </CalendarTitle>

                <CalendarActions>
                    <button onClick={handlePreviousMonth} title='Previous month'>
                        <CaretLeft />
                    </button>
                    <button onClick={handleNextMonth} title='Next month'>
                        <CaretRight />
                    </button>
                </CalendarActions>
            </CalendarHeader>

            <CalendarBody>
                <thead>
                    <tr>
                        {shortWeekDays.map((weekDay) => (
                            <th key={weekDay}>
                                {weekDay}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarWeeks.map(({ week, days }) => (
                        <tr key={week}>
                            {days.map(({ date, disabled}) => (
                                <td key={date.toISOString()}>
                                    <CalendarDay disabled={disabled} onClick={() => onDateSelected(date.toDate())}>
                                        {date.get('date')}
                                    </CalendarDay>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </CalendarBody>
        </CalendarContainer>
    )
}
