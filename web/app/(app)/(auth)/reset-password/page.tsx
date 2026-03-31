'use client'

import { useSearchParams } from 'next/navigation'
import { redirect } from 'next/navigation'
import ResetPasswordForm from '../(components)/reset-password-form'
import RequestPasswordResetForm from '../(components)/request-password-reset-form'
import { Routes } from '@/config/routes'

const passwordResetEnabled = process.env.NEXT_PUBLIC_PASSWORD_RESET_ENABLED !== 'false'

export default function ResetPasswordPage() {
  if (!passwordResetEnabled) {
    redirect(Routes.login)
  }

  const searchParams = useSearchParams()
  const otp = searchParams.get('otp')
  const email = searchParams.get('email')

  if (otp && email) {
    return <ResetPasswordForm email={decodeURIComponent(email)} otp={otp} />
  }

  return <RequestPasswordResetForm />
}
