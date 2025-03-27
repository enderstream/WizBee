import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { getYear, getMonth } from 'date-fns'
import { ko } from 'date-fns/locale/ko'
import 'react-datepicker/dist/react-datepicker.css'
import { userAPI } from '@/api/userAPI'
import {
  useUserStore,
  selectUserId,
  selectNickname,
  selectBirthday,
} from '@/store/userStore'
import CustomDatePickerHeader from '@/pages/Settings/components/CustomDatePickerHeader'
import { ProfileModalProps } from '@/types/Setting'

const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  isLoading,
  setIsLoading,
  setStatusMessage,
}) => {
  // Zustand 스토어에서 데이터 가져오기
  const userId = useUserStore(selectUserId)
  const storedNickname = useUserStore(selectNickname)
  const storedBirthday = useUserStore(selectBirthday)
  const updateUser = useUserStore((state) => state.updateUser)

  // 개인정보 폼 상태
  const [nickname, setNickname] = useState(storedNickname || '')
  const [birthDate, setBirthDate] = useState<Date | null>(
    parseBirthdayToDate(storedBirthday),
  )

  // 생년월일 문자열을 Date 객체로 변환
  function parseBirthdayToDate(birthdayStr: string) {
    if (!birthdayStr || birthdayStr.length < 10) return null
    try {
      // YYYY-MM-DD 형식 파싱
      const [year, month, day] = birthdayStr.split('-').map((n) => parseInt(n))
      // JavaScript의 Date 객체는 월이 0부터 시작하므로 month-1
      return new Date(year, month - 1, day)
    } catch (e) {
      console.error('날짜 파싱 오류:', e)
      return null
    }
  }

  // Date 객체를 YYYY-MM-DD 형식으로 변환
  const formatDateToString = (date: Date | null) => {
    if (!date) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // 프로필 정보 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    // 필수 입력값 확인
    if (!nickname) {
      setStatusMessage('닉네임을 입력해주세요.')
      return
    }

    if (!birthDate) {
      setStatusMessage('생년월일을 선택해주세요.')
      return
    }

    setIsLoading(true)
    setStatusMessage('프로필 정보 업데이트 중...')

    try {
      const birthday = formatDateToString(birthDate)

      // API 호출로 서버에 업데이트
      await userAPI.updateUser(nickname, birthday, userId)

      // 성공 시 Zustand 스토어 업데이트
      updateUser({
        nickname,
        birthday,
      })

      // 모달 닫기
      onClose()
      setStatusMessage('프로필이 성공적으로 업데이트되었습니다.')
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
      setStatusMessage('프로필 업데이트에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>내 정보 수정</h3>
        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

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
                  <CustomDatePickerHeader
                    date={date}
                    changeYear={changeYear}
                    changeMonth={changeMonth}
                    decreaseMonth={decreaseMonth}
                    increaseMonth={increaseMonth}
                    prevMonthButtonDisabled={prevMonthButtonDisabled}
                    nextMonthButtonDisabled={nextMonthButtonDisabled}
                  />
                )}
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                locale={ko}
                dateFormat="yyyy-MM-dd"
                className="custom-datepicker"
                placeholderText="생년월일을 선택하세요"
                disabled={isLoading}
                showYearDropdown
                yearDropdownItemNumber={70}
                scrollableYearDropdown
                fixedHeight
                popperClassName="custom-datepicker-popper"
                popperPlacement="bottom"
                formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
              />
            </div>
          </div>

          <div className="modal-buttons">
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileModal
