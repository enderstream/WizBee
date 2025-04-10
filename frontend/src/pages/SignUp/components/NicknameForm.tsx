// src/pages/SignUp/components/NicknameForm.tsx
import React from 'react'

interface NicknameFormProps {
  name: string
  setName: (value: string) => void
  isLoading: boolean
}

const NicknameForm: React.FC<NicknameFormProps> = ({
  name,
  setName,
  isLoading,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        닉네임
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 12.75C8.83 12.75 6.25 10.17 6.25 7C6.25 3.83 8.83 1.25 12 1.25C15.17 1.25 17.75 3.83 17.75 7C17.75 10.17 15.17 12.75 12 12.75ZM12 2.75C9.66 2.75 7.75 4.66 7.75 7C7.75 9.34 9.66 11.25 12 11.25C14.34 11.25 16.25 9.34 16.25 7C16.25 4.66 14.34 2.75 12 2.75Z"
              fill="currentColor"
            />
            <path
              d="M20.5901 22.75C20.1801 22.75 19.8401 22.41 19.8401 22C19.8401 18.55 16.3601 15.75 12.0001 15.75C7.64006 15.75 4.16006 18.55 4.16006 22C4.16006 22.41 3.82006 22.75 3.41006 22.75C3.00006 22.75 2.66006 22.41 2.66006 22C2.66006 17.73 6.85006 14.25 12.0001 14.25C17.1501 14.25 21.3401 17.73 21.3401 22C21.3401 22.41 21.0001 22.75 20.5901 22.75Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
          placeholder={name}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-transparent shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-100 disabled:text-gray-500 transition"
          autoComplete="off"
        />
      </div>
      {!name && (
        <p className="text-sm text-red-500 mt-1">
          닉네임을 입력해주세요
        </p>
      )}
    </div>
  )
}

export default NicknameForm