import React from 'react'
import DatePicker from 'react-datepicker'
import { getYear, getMonth } from 'date-fns'
import { ko } from 'date-fns/locale/ko' // 한국어 로케일
import 'react-datepicker/dist/react-datepicker.css'
import { ProfileFormProps } from '@/types/ProfileForm'

// range 함수 helper
const range = (start: number, end: number, step = 1) => {
  const result = []
  for (let i = start; i <= end; i += step) {
    result.push(i)
  }
  return result
}

// 닉네임과 생년월일만 포함하는 재사용 가능한 글로벌 컴포넌트
const ProfileForm: React.FC<ProfileFormProps> = ({
  nickname,
  birthDate,
  setNickname,
  setBirthDate,
  isLoading = false,
}) => {
  // 한국어 월 이름 배열
  const months = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ]

  // 연도 범위 (1950년부터 현재 연도까지)
  const years = range(1950, getYear(new Date()), 1)

  return (
    <>
      {/* 닉네임 입력 */}
      <div className="form-group">
        <label htmlFor="nickname">닉네임</label>
        <div className="input-container">
          <i className="user-icon"></i>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* 생년월일 입력 - DatePicker 사용 */}
      <div className="form-group">
        <label>생년월일</label>
        <div className="datepicker-container">
          <DatePicker
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="datepicker-header">
                <button
                  type="button" // 명시적으로 button 타입 지정
                  onClick={(e) => {
                    e.preventDefault() // 제출 방지
                    decreaseMonth()
                  }}
                  disabled={prevMonthButtonDisabled}
                  className="month-nav-button"
                >
                  {'<'}
                </button>

                <div className="year-month-selects">
                  <select
                    value={getYear(date)}
                    onChange={({ target: { value } }) =>
                      changeYear(parseInt(value))
                    }
                    className="year-select"
                  >
                    {years.map((option) => (
                      <option key={option} value={option}>
                        {option}년
                      </option>
                    ))}
                  </select>

                  <select
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) =>
                      changeMonth(months.indexOf(value))
                    }
                    className="month-select"
                  >
                    {months.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button" // 명시적으로 button 타입 지정
                  onClick={(e) => {
                    e.preventDefault() // 제출 방지
                    increaseMonth()
                  }}
                  disabled={nextMonthButtonDisabled}
                  className="month-nav-button"
                >
                  {'>'}
                </button>
              </div>
            )}
            selected={birthDate}
            onChange={(date) => setBirthDate(date)}
            locale={ko}
            dateFormat="yyyy-MM-dd"
            className="custom-datepicker"
            placeholderText="생년월일을 선택하세요"
            disabled={isLoading}
            required
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={70}
            fixedHeight
            popperClassName="custom-datepicker-popper"
            popperPlacement="bottom"
            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
          />
        </div>
      </div>
    </>
  )
}

export default ProfileForm
