import { Suspense } from 'react'
import { Loader } from 'lucide-react'

import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
    return (
        <Suspense fallback={<Loader className="animate-spin" />}>
            <SignupForm />
        </Suspense>
    )
}
